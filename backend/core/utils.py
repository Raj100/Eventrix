from bson import ObjectId

def serialize_mongo(document: dict) -> dict:
    """
    Convert MongoDB document to JSON-serializable dict
    """
    if not document:
        return document

    doc = document.copy()

    if "_id" in doc and isinstance(doc["_id"], ObjectId):
        doc["id"] = str(doc["_id"])
        del doc["_id"]

    return doc


def serialize_mongo_list(documents: list) -> list:
    return [serialize_mongo(doc) for doc in documents]
