export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findAll(query = {}) {
   const { limit, skip, sort, ...filters } = query;

    let dbQuery = this.model.find(filters);

    if (sort) dbQuery = dbQuery.sort(JSON.parse(sort));
    if (skip) dbQuery = dbQuery.skip(Number(skip));
    if (limit) dbQuery = dbQuery.limit(Number(limit));
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
