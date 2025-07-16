import logging
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from etl.etl_pipeline import invoices_table
from faktoorHunter2025 import detect_invalid_ids
from invoice_trace_dark import flag_suspect_invoices
from rag_entity_alias import resolve_aliases

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine('postgresql://user:pass@localhost:5432/invoices')


def analyze():
    with Session(engine) as session:
        rows = session.execute(select(invoices_table)).all()
        invoices = [r.invoice for r in rows]

    invalid = detect_invalid_ids(invoices)
    suspect = flag_suspect_invoices(invoices)
    aliases = resolve_aliases([inv.get('economicCode') for inv in invoices])

    report = {
        'invalid_count': len(invalid),
        'suspect_count': len(suspect),
        'aliases': aliases
    }
    logger.info(report)


if __name__ == '__main__':
    analyze()
