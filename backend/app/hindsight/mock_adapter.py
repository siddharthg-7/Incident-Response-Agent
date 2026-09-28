import re
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.hindsight.base import BaseHindsightAdapter


class MockHindsightAdapter(BaseHindsightAdapter):
    """In-memory multi-strategy memory adapter for testing and offline development.
    
    Provides high-fidelity recall simulation using tokenization, keyword overlap,
    and multi-field scoring so the memory loop functions deterministically.
    """

    def __init__(self):
        # bank_id -> list of memory objects
        self.banks: Dict[str, List[Dict[str, Any]]] = {}

    def _tokenize(self, text: str) -> set:
        """Tokenize text into normalized lowercase word tokens."""
        if not text:
            return set()
        return set(re.findall(r"\b[a-zA-Z0-9_\-\.]+\b", text.lower()))

    async def retain(
        self,
        bank_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        if bank_id not in self.banks:
            self.banks[bank_id] = []

        memory_record = {
            "id": f"mem-{len(self.banks[bank_id]) + 1:04d}",
            "bank_id": bank_id,
            "content": content,
            "metadata": metadata or {},
            "tokens": self._tokenize(content + " " + " ".join(str(v) for v in (metadata or {}).values())),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        self.banks[bank_id].append(memory_record)
        return {
            "status": "retained",
            "memory_id": memory_record["id"],
            "bank_id": bank_id
        }

    async def recall(
        self,
        bank_id: str,
        query: str,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        memories = self.banks.get(bank_id, [])
        if not memories or not query:
            return []

        query_tokens = self._tokenize(query)
        if not query_tokens:
            return []

        scored_results = []
        for mem in memories:
            mem_tokens = mem["tokens"]
            common_tokens = query_tokens.intersection(mem_tokens)
            total_tokens = query_tokens.union(mem_tokens)

            # Jaccard + Overlap composite score
            jaccard = len(common_tokens) / len(total_tokens) if total_tokens else 0.0
            overlap = len(common_tokens) / len(query_tokens) if query_tokens else 0.0
            
            # Boost score if specific high-value security terms match
            critical_terms = {"ssh", "brute", "force", "password", "root", "auth", "sshd", "port", "credential"}
            query_critical = query_tokens.intersection(critical_terms)
            matched_critical = query_critical.intersection(mem_tokens)
            critical_ratio = len(matched_critical) / len(query_critical) if query_critical else 0.0

            # Composite score combining token overlap and domain relevance
            composite = (0.25 * jaccard) + (0.35 * overlap) + (0.4 * critical_ratio)
            final_score = min(0.96, round(composite * 1.5, 3))

            if final_score > 0.15:
                scored_results.append({
                    "id": mem["id"],
                    "content": mem["content"],
                    "metadata": mem["metadata"],
                    "score": round(final_score, 3)
                })

        # Sort by similarity score descending
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:limit]

    async def health_check(self) -> Dict[str, Any]:
        total_memories = sum(len(mems) for mems in self.banks.values())
        return {
            "status": "healthy",
            "mode": "mock",
            "banks_active": len(self.banks),
            "total_memories_indexed": total_memories
        }

    def clear(self):
        """Utility for test isolation."""
        self.banks.clear()
