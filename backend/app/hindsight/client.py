from typing import Optional
from app.core.config import settings
from app.hindsight.base import BaseHindsightAdapter
from app.hindsight.client_adapter import HindsightClientAdapter
from app.hindsight.mock_adapter import MockHindsightAdapter


def create_hindsight_client(
    mode: Optional[str] = None,
    base_url: Optional[str] = None,
    api_key: Optional[str] = None
) -> BaseHindsightAdapter:
    """Factory creating appropriate Hindsight adapter based on deployment mode."""
    active_mode = mode or settings.HINDSIGHT_MODE
    if active_mode == "client":
        return HindsightClientAdapter(
            base_url=base_url or settings.HINDSIGHT_BASE_URL,
            api_key=api_key or settings.HINDSIGHT_API_KEY
        )
    return MockHindsightAdapter()


__all__ = ["create_hindsight_client", "HindsightClientAdapter", "MockHindsightAdapter"]
