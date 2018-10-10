import l from '../../common/logger';
import db from './examples.db.service';

class ExamplesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return db.byId(id);
  }

  create(name) {
    return db.insert(name);
  }
  echo(Message){
    return Promise.resolve("your message is " + Message);
  }
}

export default new ExamplesService();
