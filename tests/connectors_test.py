import types
from connectors.modian_connector import ModianConnector, ModianConfig


def test_fetch_empty(monkeypatch):
    cfg = ModianConfig(api_key="test", base_url="https://mock.mdian/api")
    connector = ModianConnector(cfg)

    def fake_get(url, params=None, timeout=0):
        class Resp:
            status_code = 200

            def json(self):
                return {"data": []}

            def raise_for_status(self):
                pass

        return Resp()

    monkeypatch.setattr(connector.session, "get", fake_get)
    data = connector.fetch_invoices("2025-01-01", "2025-01-31")
    assert data == []
