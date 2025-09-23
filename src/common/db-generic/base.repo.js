export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findAll(query = {}) {
    const { limit, skip, sort, ...filters } = query;

    const options = {};
    if (limit) options.limit = parseInt(limit);
    if (skip) options.skip = parseInt(skip);
    if (sort) options.sort = JSON.parse(sort);
    let dbQuery = this.model.find(filters);
    if (options.sort) {
      dbQuery = dbQuery.sort(options.sort);
    }
    if (typeof options.skip === "number") {
      dbQuery = dbQuery.skip(options.skip);
    }
    if (typeof options.limit === "number") {
      dbQuery = dbQuery.limit(options.limit);
    }
    return dbQuery.lean();
  }

  async findOne(filter, projection = {}) {
    return this.model.findOne(filter, projection).lean();
  }

  async findById(id, projection = {}) {
    return this.model.findById(id, projection).lean();
  }

  async updateById(id, newData) {
    return this.model.findByIdAndUpdate(id, newData, { new: true }).lean();
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id).lean();
  }
  
}
