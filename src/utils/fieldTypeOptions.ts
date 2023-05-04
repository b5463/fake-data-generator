import { faker } from './faker'
import { removeFromArray } from './array'

export interface IRowDatas {
  fieldName: string
  fieldType: string
  groupType: AvailableGroupTypes
}

export type AvailableGroupTypes = keyof typeof faker

interface fieldTypeOptions {
  type: AvailableGroupTypes
  subtypes: string[]
}

export const fieldTypeOptions: fieldTypeOptions[] = [
  {
    type: 'name',
    subtypes: removeFromArray(Object.keys(faker.name), 'faker'),
  },
  {
    type: 'address',
    subtypes: removeFromArray(Object.keys(faker.address), 'faker'),
  },
  {
    type: 'date',
    subtypes: removeFromArray(Object.keys(faker.date), 'faker'),
  },
  {
    type: 'random',
    subtypes: removeFromArray(Object.keys(faker.random), 'faker'),
  },
  {
    type: 'phone',
    subtypes: removeFromArray(Object.keys(faker.phone), 'faker'),
  },
  {
    type: 'lorem',
    subtypes: removeFromArray(Object.keys(faker.lorem), 'faker'),
  },
  {
    type: 'image',
    subtypes: removeFromArray(Object.keys(faker.image), 'faker'),
  },
  {
    type: 'time',
    subtypes: ['recent'],
  },
  {
    type: 'company',
    subtypes: removeFromArray(Object.keys(faker.company), 'faker'),
  },
  {
    type: 'finance',
    subtypes: removeFromArray(Object.keys(faker.finance), 'faker'),
  },
  {
    type: 'datatype',
    subtypes: removeFromArray(Object.keys(faker.datatype), 'faker'),
  },
  {
    type: 'commerce',
    subtypes: removeFromArray(Object.keys(faker.commerce), 'faker'),
  },
  {
    type: 'word',
    subtypes: removeFromArray(Object.keys(faker.word), 'faker'),
  },
]

type FieldTypeOptionsMapObject = {
  [Property in string]: AvailableGroupTypes
}

let fieldTypeOptionsMapObject: FieldTypeOptionsMapObject = {}

fieldTypeOptions.forEach((currentType) => {
  currentType.subtypes.forEach((subtype) => {
    fieldTypeOptionsMapObject[subtype] = currentType.type
  })
})

export const getTypeBySubtype = (subtype: string) => {
  return fieldTypeOptionsMapObject[subtype]
}
