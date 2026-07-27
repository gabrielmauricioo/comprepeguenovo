import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Produto',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'desc',
      title: 'Descrição',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Preço (R$)',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'oldPrice',
      title: 'Preço Antigo (Opcional)',
      type: 'number',
    }),
    defineField({
      name: 'imgs', // Agora é um array de imagens!
      title: 'Fotos do Produto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'details', // Agora é uma lista de textos!
      title: 'Detalhes (Lista de Tópicos)',
      description: 'Adicione os itens do checklist (ex: "Conjunto completo: box + colchão")',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'cat',
      title: 'Categoria',
      type: 'string',
      options: {
        list: ['Sofás', 'Camas', 'Eletrodomésticos', 'Eletrônicos', 'Móveis', 'Decoração'],
      },
    }),
    defineField({
      name: 'isNew',
      title: 'É um produto novo?',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})