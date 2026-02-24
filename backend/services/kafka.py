from typing import Dict


class KafkaProducerStub:
    def __init__(self, config: Dict[str, str]):
        self.config = config

    def send(self, topic: str, value: Dict):
        return {"topic": topic, "value": value}


producer = KafkaProducerStub(config={"bootstrap.servers": "localhost:9092"})

