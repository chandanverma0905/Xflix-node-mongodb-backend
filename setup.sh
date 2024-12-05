
# # Setup file to upload data to MongoDB
# mongo xflix --eval "db.dropDatabase()"
# mongoimport -d xflix -c videos --files data/export_xflix_videos.json



# Setup file to upload data to MongoDB
# mongo xflix --eval "db.dropDatabase()"
# mongoimport --db xflix --collection videos --file data/export_xflix_videos.json --jsonArray


# Setup file to upload data to MongoDB
mongo xflix --eval "db.dropDatabase()"
mongoimport -d xflix -c videos --file data/export_xflix_videos.json
