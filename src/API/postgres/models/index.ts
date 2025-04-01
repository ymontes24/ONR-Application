import User from './user.model';
import Association from './association.model';
import Unit from './unit.model';
import UserUnit from './user-unit.model';
import UserAssociation from './user-association.model';

export {
  User,
  Association,
  Unit,
  UserUnit,
  UserAssociation,
};

export const initModels = async () => {
  
  console.log('Modelos PostgreSQL inicializados correctamente');
};