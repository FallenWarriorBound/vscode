from analysis.analysis_pipeline import analyze

class DummySession:
    def __init__(self, engine):
        pass

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        pass

    def execute(self, stmt):
        class Row:
            invoice = {}
        return [Row()]


def test_analyze_runs(monkeypatch):
    monkeypatch.setattr('analysis.analysis_pipeline.Session', DummySession)
    monkeypatch.setattr('analysis.analysis_pipeline.detect_invalid_ids', lambda x: [])
    monkeypatch.setattr('analysis.analysis_pipeline.flag_suspect_invoices', lambda x: [])
    monkeypatch.setattr('analysis.analysis_pipeline.resolve_aliases', lambda x: [])

    analyze()
