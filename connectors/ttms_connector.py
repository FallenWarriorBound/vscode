import logging
import requests
from typing import List, Dict
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

class TTMSConfig(BaseModel):
    api_key: str
    api_secret: str
    base_url: str = Field("https://ttms.ir/api/v1")

class TTMSConnector:
    def __init__(self, config: TTMSConfig):
        self.config = config
        self.session = requests.Session()
        self.session.auth = (self.config.api_key, self.config.api_secret)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def _get(self, url: str, params: Dict) -> requests.Response:
        logger.info("%s %s", url, params)
        resp = self.session.get(url, params=params, timeout=30)
        resp.raise_for_status()
        return resp

    def fetch_invoices(self, start_date: str, end_date: str) -> List[Dict]:
        url = f"{self.config.base_url}/transactions/invoices"
        params = {"from": start_date, "to": end_date}
        resp = self._get(url, params)
        return resp.json().get("invoices", [])
