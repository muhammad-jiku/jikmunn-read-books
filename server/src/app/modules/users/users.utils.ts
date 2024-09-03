import { User } from './users.model';

export const findLastCustomerId = async (): Promise<string | undefined> => {
  const lastCustomer = await User.findOne(
    { role: 'customer' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastCustomer?.id ? lastCustomer?.id.substring(4) : undefined;
};

export const generateCustomerId = async (): Promise<string> => {
  const currentId =
    (await findLastCustomerId()) || (0).toString().padStart(5, '0');

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `C-${incrementedId}`;

  return incrementedId;
};

export const findLastAuthorId = async (): Promise<string | undefined> => {
  const lastAuthor = await User.findOne({ role: 'author' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAuthor?.id ? lastAuthor?.id.substring(2) : undefined;
};

export const generateAuthorId = async (): Promise<string> => {
  const currentId =
    (await findLastAuthorId()) || (0).toString().padStart(5, '0');

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `W-${incrementedId}`;

  return incrementedId;
};

export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin?.id.substring(2) : undefined;
};

export const generateAdminId = async (): Promise<string> => {
  const currentId =
    (await findLastAdminId()) || (0).toString().padStart(5, '0');

  let incrementedId = (parseInt(currentId) + 1).toString().padStart(5, '0');
  incrementedId = `A-${incrementedId}`;

  return incrementedId;
};
