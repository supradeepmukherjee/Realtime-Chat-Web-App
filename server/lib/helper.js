export const findOtherPerson = (members, id) => members.find(m => m._id.toString() !== id.toString())