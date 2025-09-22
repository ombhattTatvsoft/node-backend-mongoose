export default class BaseRepo {
  constructor(model) {
    this.model = model;
  }
  async create(data) {
    return this.model.create(data);
  }
  async findAll(filter = {}, options = {}) {
    const { limit = 20, skip = 0, sort = { createdAt: -1 } } = options;
    return this.model.find(filter).sort(sort).skip(skip).limit(limit).lean();
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
