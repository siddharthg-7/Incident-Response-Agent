from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class BaseHindsightAdapter(ABC):
    """Abstract adapter defining the contract for Hindsight memory interactions."""

    @abstractmethod
    async def retain(
        self,
        bank_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Retain an outcome-oriented experience capsule into persistent memory.
        
        Args:
            bank_id: Logical memory bank identifier.
            content: Detailed text/JSON capsule of the experience.
            metadata: Structured tags (incident_id, incident_type, severity, etc.).
        """
        pass

    @abstractmethod
    async def recall(
        self,
        bank_id: str,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall relevant past experiences using multi-strategy memory retrieval.
        
        Args:
            bank_id: Logical memory bank identifier.
            query: Current incident context or symptom query.
            limit: Maximum number of relevant experiences to retrieve.
        """
        pass

    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Verify connectivity to the memory engine."""
        pass
