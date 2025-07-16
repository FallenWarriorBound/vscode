# Modian and TTMS Data Pipeline

This package provides connectors and analysis tools for fetching and processing invoice data from the Iranian Modian and TTMS systems. The pipeline includes ETL scripts, analysis modules, and simple integration tests.

## Structure

```
connectors/
  modian_connector.py
  ttms_connector.py
etl/
  etl_pipeline.py
analysis/
  analysis_pipeline.py
tests/
  connectors_test.py
  analysis_test.py
config.yaml
requirements.txt
```

Refer to `config.yaml` for configuration placeholders. Install dependencies from `requirements.txt` and run the ETL and analysis scripts as needed.
