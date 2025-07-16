import logging
import requests
from typing import List, Dict
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

class ModianConfig(BaseModel):
    api_key: str
    base_url: str = Field("https://mdian.ir/api/v1")

class ModianConnector:
    def __init__(self, config: ModianConfig):
        self.config = config
        self.session = requests.Session()
        self.session.headers.update({"Authorization": f"Bearer {self.config.api_key}"})

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def _get(self, url: str, params: Dict) -> requests.Response:
        logger.info("%s %s", url, params)
        resp = self.session.get(url, params=params, timeout=30)
        resp.raise_for_status()
        return resp

    def fetch_invoices(self, start_date: str, end_date: str) -> List[Dict]:
        """Fetch invoices from Modian within a date range."""
        url = f"{self.config.base_url}/invoices"
        params = {"startDate": start_date, "endDate": end_date}
        resp = self._get(url, params)
        return resp.json().get("data", [])
