from pyspark.sql import SparkSession, functions as F
from backend.settings import KafkaTopics, MongoCollections


def create_spark(app_name: str = "StudentFeaturePipeline") -> SparkSession:
    spark = (
        SparkSession.builder.appName(app_name)
        .config("spark.mongodb.output.uri", "mongodb://localhost:27017/academic_feature_store")
        .getOrCreate()
    )
    return spark


def read_kafka_stream(spark: SparkSession, topic: str):
    return (
        spark.readStream.format("kafka")
        .option("kafka.bootstrap.servers", "localhost:9092")
        .option("subscribe", topic)
        .load()
    )


def parse_event(df):
    return df.selectExpr("CAST(value AS STRING) as json").select(F.from_json("json", "student_id string, course_id string, present boolean, timestamp timestamp").alias("data")).select(
        "data.*"
    )


def compute_features(attendance_df):
    grouped = attendance_df.groupBy("student_id", "course_id").agg(
        (F.sum(F.when(F.col("present") == True, 1).otherwise(0)) / F.count("*")).alias("attendance_percent"),
        F.max("timestamp").alias("last_seen_at"),
    )
    return grouped


def write_to_feature_store(features_df):
    query = (
        features_df.writeStream.outputMode("update")
        .format("mongodb")
        .option("checkpointLocation", "/tmp/checkpoints/student_features")
        .option("collection", MongoCollections.STUDENT_FEATURES)
        .start()
    )
    return query


def main():
    spark = create_spark()
    raw_stream = read_kafka_stream(spark, KafkaTopics.ATTENDANCE)
    parsed = parse_event(raw_stream)
    features = compute_features(parsed)
    query = write_to_feature_store(features)
    query.awaitTermination()


if __name__ == "__main__":
    main()

