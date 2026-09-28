import logging
from typing import Any, Dict, List, Optional
import httpx
from app.hindsight.base import BaseHindsightAdapter

logger = logging.getLogger(__name__)


class HindsightClientAdapter(BaseHindsightAdapter):
    """Adapter for connecting to Hindsight Cloud or self-hosted Hindsight daemon."""

    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.headers = {"Content-Type": "application/json"}
        if self.api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"

    async def retain(
        self,
        bank_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/banks/{bank_id}/memories"
        payload = {
            "content": content,
            "metadata": metadata or {}
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=payload, headers=self.headers)
                response.raise_for_status()
                return response.json()
        except Exception as exc:
            logger.error(f"Hindsight client retain failed: {exc}")
            # Raise or return informative error
            return {
                "status": "error",
                "error": str(exc),
                "bank_id": bank_id
            }

    async def recall(
        self,
        bank_id: str,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/banks/{bank_id}/recall"
        payload = {
            "query": query,
            "limit": limit
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(url, json=payload, headers=self.headers)
                response.raise_for_status()
                data = response.json()
                # Normalize results to list of dicts with id, content, metadata, score
                raw_results = data.get("results", data if isinstance(data, list) else [])
                formatted = []
                for item in raw_results:
                    formatted.append({
                        "id": item.get("id", ""),
                        "content": item.get("content", item.get("text", "")),
                        "metadata": item.get("metadata", {}),
                        "score": item.get("score", 0.0)
                    })
                return formatted
        except Exception as exc:
            logger.error(f"Hindsight client recall failed: {exc}")
            return []

    async def health_check(self) -> Dict[str, Any]:
        url = f"{self.base_url}/health"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(url, headers=self.headers)
                return {
                    "status": "healthy" if response.status_code == 200 else "degraded",
                    "mode": "client",
                    "endpoint": self.base_url,
                    "http_status": response.status_code
                }
        except Exception as exc:
            return {
                "status": "unreachable",
                "mode": "client",
                "endpoint": self.base_url,
                "error": str(exc)
            }
