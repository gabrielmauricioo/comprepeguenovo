import { type SchemaTypeDefinition } from 'sanity'
import { productType } from './product' // Adicione esta linha

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType], // Coloque o productType aqui dentro
}
