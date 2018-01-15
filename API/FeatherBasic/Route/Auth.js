class Auth {
  constructor() {
    this.messages = [];
    this.currentId = 0;
  }

  async find(params) {
	 console.log("findAuth");
     return ["find"];
  }

  async get(id, params) {
   
    console.log("getfindAuth");
    const message = this.messages.find(message => message.id === parseInt(id, 10));
    if(!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    return ['get'];
  }

  async create(data, params) {
     
	  console.log("createfindAuth");
    const message = Object.assign({
      id: ++this.currentId
    }, data);

    this.messages.push(message);

    return message;
  }

  async patch(id, data, params) {
    console.log("patchfindAuth");
    const message = await this.get(id);
    return Object.assign(message, data);
  }

  async remove(id, params) {
    console.log("removefindAuth");
    const message = await this.get(id);
    const index = this.messages.indexOf(message);
    this.messages.splice(index, 1);
    return message;
  }
}

module.exports = Auth;