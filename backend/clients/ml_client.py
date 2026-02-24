import httpx


class MlClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    async def predict_risk(self, student_id: str, course_id: str):
        async with httpx.AsyncClient(base_url=self.base_url) as client:
            response = await client.post(
                "/predict",
                json={"student_id": student_id, "course_id": course_id},
                timeout=5.0,
            )
            response.raise_for_status()
            return response.json()

