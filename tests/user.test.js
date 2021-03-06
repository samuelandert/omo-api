import 'cross-fetch/polyfill'
import ApolloBoost, {gql} from 'apollo-boost'
import bcrypt from 'bcryptjs'
import prisma from '../src/prisma'

const client = new ApolloBoost({
    uri: 'http://localhost:4000'
})

beforeEach(async () => {
    await prisma.mutation.deleteManyCities()
    await prisma.mutation.deleteManyUsers()
    const user = await prisma.mutation.createUser({
        data: {
            name: "Maja Mama-Maria",
            email: "maja@styl.earth",
            password: bcrypt.hashSync('secret123!@#+*')
        }
    })
    await prisma.mutation.createCity({data: {
        name: "Minga (public)",
        available: true,
        author: {
            connect: {
                id: user.id
            } 
        }
    }})
    await prisma.mutation.createCity({data: {
        name: "Minga (not available yet)",
        available: false,
        author: {
            connect: {
                id: user.id
            } 
        }
    }})
})

test('Should create new user', async () => {
    const createUser = gql`
        mutation {
            createUser(data: {
                name: "Lino Vino",
                email: "lino@styl.earth",
                password: "password"
            }) {
                token,
                user {
                    id
                }
            } 
        }
    `
    const response = await client.mutate({
        mutation: createUser
    })

    const exists = await prisma.exists.User( { id : response.data.createUser.user.id })
    expect(exists).toBe(true)
}) 


test('Should expose public author profiles', async () => {
    const getUsers = gql`
        query { 
            users {
                id
                name
            }
        }
    `
    const response = await client.query({ query: getUsers })

    expect(response.data.users.length).toBe(1)
    expect(response.data.users[0].name).toBe("Maja Mama-Maria")
})

test('Should expose public cities', async () => {
    const getCities = gql`
        query {
            cities {
                id
                name
                available
            }
        }
    `
    const response = await client.query({ query: getCities})
    expect(response.data.cities.length).toBe(1)
    expect(response.data.cities[0].available).toBe(true)
})