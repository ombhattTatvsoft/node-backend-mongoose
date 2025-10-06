export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  populate(query,includes){
    if (includes && includes.length > 0) {
      for (const include of includes) {
        query = query.populate(include);
      }
    }
    return query;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findAll(queryParams = {}, includes = [], projection={}) {
    const { limit, skip, sort, ...filter } = queryParams;
    let query = this.model.find(filter,projection);
    query = this.populate(query,includes);

    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(Number(skip));
    if (limit) query = query.limit(Number(limit));

    return query.lean();
  }

  async findOne(filter = {}, includes = [], projection = {}) {
    let query = this.model.findOne(filter, projection);
    query = this.populate(query,includes);
    return query.lean();
  }

  async findById(id, includes = [], projection = {}) {
    let query = this.model.findById(id, projection);
    query = this.populate(query,includes);
    return query.lean();
  }

  async updateById(id, newData) {
    return this.model.findByIdAndUpdate(id, newData, { new: true }).lean();
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id).lean();
  }
  
}
