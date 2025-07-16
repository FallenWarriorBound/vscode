import yaml
from datetime import datetime
import logging

from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, JSON, DateTime

from connectors.modian_connector import ModianConnector, ModianConfig
from connectors.ttms_connector import TTMSConnector, TTMSConfig

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_config(path="../config.yaml"):
    with open(path) as f:
        return yaml.safe_load(f)

cfg = load_config()
md_config = ModianConfig(**cfg['modian'])
ttms_config = TTMSConfig(**cfg['ttms'])

engine = create_engine(cfg['database']['url'], echo=False)
metadata = MetaData()

invoices_table = Table(
    'raw_invoices', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('source', String, nullable=False),
    Column('invoice', JSON, nullable=False),
    Column('fetched_at', DateTime, default=datetime.utcnow)
)
metadata.create_all(engine)


def run_etl(start_date: str, end_date: str):
    with engine.begin() as conn:
        modian = ModianConnector(md_config)
        data_m = modian.fetch_invoices(start_date, end_date)
        for inv in data_m:
            conn.execute(invoices_table.insert().values(source='modian', invoice=inv))

        ttms = TTMSConnector(ttms_config)
        data_t = ttms.fetch_invoices(start_date, end_date)
        for inv in data_t:
            conn.execute(invoices_table.insert().values(source='ttms', invoice=inv))
    logger.info("ETL completed: %s modian + %s ttms invoices", len(data_m), len(data_t))


if __name__ == '__main__':
    run_etl('2024-03-21', '2025-03-20')
