class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    console.log("inside cls:", this.query);
    console.log("inside cls this.queryStr:", this.queryStr);

    const queryObj = { ...this.queryStr };
    const excludedFields = ["sort", "page", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const convertedQuery = {};

    //1.filtering find({duration:{$gte:100},ratings:{$lt:35}})
    for (const key in queryObj) {
      if (key.includes("[") && key.includes("]")) {
        const [field, opWithBracket] = key.split("[");
        const operator = `$${opWithBracket.replace("]", "")}`;
        if (!convertedQuery[field]) {
          convertedQuery[field] = {};
        }
        convertedQuery[field][operator] = queryObj[key];
      } else {
        convertedQuery[key] = queryObj[key];
      }
    }

    this.query = this.query.find(convertedQuery);
    console.log("this.query:", this.query);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(`${sortBy}`); // e.g., sort('duration -ratings')
    } else {
      this.query = this.query.sort("-createdAt"); // default sort
    }

    return this;
  }

  limitingFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      console.log("fields:", fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeature;
