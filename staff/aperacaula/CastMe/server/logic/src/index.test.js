'use strict'

require('dotenv').config()

const { mongoose, models: { User, Casting, Project, ProfessionalData, PersonalData, PhysicalData } } = require('../../data')
const { expect } = require('chai')
const logic = require('.')
const _ = require('lodash')

const { env: { DB_URL } } = process

describe('logic', () => {
    const userData = {
        email: 'aperacaula@gmail.com',
        password: '12345',
        personalData: new PersonalData({

            name: 'Alex',
            surname: 'Peracaula',
            birthDate: new Date('10/07/1993'),
            sex: 'male',
            twins: true,
            province: 'Barcelona',
            phone: 630075725

        }),

        physicalData: new PhysicalData({

            height: 1.77,
            weight: 67,
            physicalCondition: 'fit',
            eyes: 'green',
            hair: 'buzzed',
            ethnicity: 'caucasian',
            beard: true,
            tattoos: true,
            piercings: false

        }),

        professionalData: new ProfessionalData({

            profession: 'actor/actress',
            singing: true,
            dancing: true,
            otherHabilities: 'surfing',
            previousJobExperiences: 20,
            curriculum: ['The Importance of Being Earnest, TNC', 'Hello World, E.G.Wells']

        }),

        videobookLink: 'https://youtube.com',

        pics: [],
    }

    const otherUserData = {
                email: 'apr1993@hotmail.com',
                password: '12345',
                personalData: new PersonalData({

                    name: 'Alexia',
                    surname: 'Peracaula',
                    birthDate: new Date('10/07/2000'),
                    sex: 'female',
                    twins: true,
                    province: 'Madrid',
                    phone: 630075726

                }),

                physicalData: new PhysicalData({

                    height: 1.60,
                    weight: 61,
                    physicalCondition: 'fit',
                    eyes: 'green',
                    hair: 'brown',
                    ethnicity: 'caucasian',
                    beard: false,
                    tattoos: false,
                    piercings: false

                }),

                professionalData: new ProfessionalData({

                    profession: 'actor/actress',
                    singing: false,
                    dancing: true,
                    otherHabilities: 'yoga',
                    previousJobExperiences: 10,
                    curriculum: ['Here, Malnascuts']

                }),

                videobookLink: 'https://youtube.com',

                pics: [],
    }
    const dummyUserId = '123456781234567812345678'
    const dummyNoteId = '123456781234567812345678'
    const projects = require('./projects-generator')

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => {

        return Promise.all([User.remove(), Project.deleteMany()])
    })

    describe('register user', () => {
        it('should succeed on correct dada', () =>
            logic.registerUser(userData.email, userData.password, userData.personalData, userData.physicalData, userData.professionalData, userData.videobookLink, userData.pics)
                .then(res => {
                    expect(res).to.be.true
                })
                

        )

        it('should fail on already registered user', () =>
            User.create(userData)
                .then(() => {

                    return logic.registerUser(userData.email, userData.password, userData.personalData, userData.physicalData, userData.professionalData, userData.videobookLink, userData.pics)
                })
                .catch(({ message }) => {
                    expect(message).to.equal(`user with email ${userData.email} already exists`)
                })
        )

        it('should fail on no user name', () =>
            logic.registerUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user name', () =>
            logic.registerUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user name', () =>
            logic.registerUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user surname', () =>
            logic.registerUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.registerUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.registerUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on no personal data', () =>
            logic.registerUser(userData.email, userData.password)
                .catch(({ message }) => expect(message).to.equal('personal data is not what it should be'))
        )

        it('should fail on empty personal data', () =>
            logic.registerUser(userData.email, userData.password, '')
                .catch(({ message }) => expect(message).to.equal('personal data is not what it should be'))
        )

    })

    describe('authenticate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(() =>
                    logic.authenticateUser('aperacaula@gmail.com', '12345')
                        .then(id => expect(id).to.exist)
                )
        )

        it('should fail on no user email', () =>
            logic.authenticateUser()
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.authenticateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.authenticateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.authenticateUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.authenticateUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.authenticateUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('retrieve user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.retrieveUser(id)
                })
                .then(user => {
                    expect(user).to.exist

                    const { email, _id, password, personalData, physicalData, professionalData, videobookLink, pics, castings } = user

                    
                    expect(email).to.equal('aperacaula@gmail.com')

                    expect(_id).to.be.undefined
                    expect(password).to.be.undefined
                    expect(castings).to.exist
                })
        )

        it('should fail on no user id', () =>
            logic.retrieveUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.retrieveUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.retrieveUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    describe('udpate user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ email, password }) => {
                    
                    return logic.updateUser(userData.email, userData.password, 'jd@mail.com', '123', userData.personalData, userData.physicalData, userData.professionalData, userData.videobookLink, userData.pics)
                        .then(res => {
                            expect(res).to.be.true

                            return User.findOne({email: 'jd@mail.com'})
                        })
                        .then(user => {
                            expect(user).to.exist

                            const { email, password, personalData, physicalData, professionalData, videobookLink, pics } = user
                            
                            expect(email).to.equal('jd@mail.com')
                            expect(password).to.equal('123')
                            expect(Object.values(personalData.toObject()).toString()).to.equal(Object.values(userData.personalData.toObject()).toString())
                        })
                })
        )

        it('should fail on changing email to an already existing user\'s email', () =>
            Promise.all([
                User.create(userData),
                User.create(otherUserData)
            ])
                .then(([{ email: email1 }, { email: email2 }]) => {
                    const { email, password } = userData
                    
                    return logic.updateUser(email, password, email2, '123', userData.personalData, userData.physicalData, userData.professionalData, userData.videobookLink, userData.pics)
                })
                .catch(({ message }) => expect(message).to.equal(`user with email ${otherUserData.email} already exists`))
        )


        it('should fail on empty user email', () =>
            logic.updateUser('')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.updateUser('     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.updateUser(userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.updateUser(userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.updateUser(userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    describe('unregister user', () => {
        it('should succeed on correct data', () =>
            User.create(userData)
                .then(({ id }) => {
                    return logic.unregisterUser(id, 'aperacaula@gmail.com', '12345')
                        .then(res => {
                            expect(res).to.be.true

                            return User.findById(id)
                        })
                        .then(user => {
                            expect(user).to.be.null
                        })
                })
        )

        it('should fail on no user id', () =>
            logic.unregisterUser()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.unregisterUser('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.unregisterUser('     ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on no user email', () =>
            logic.unregisterUser(dummyUserId)
                .catch(({ message }) => expect(message).to.equal('user email is not a string'))
        )

        it('should fail on empty user email', () =>
            logic.unregisterUser(dummyUserId, '')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on blank user email', () =>
            logic.unregisterUser(dummyUserId, '     ')
                .catch(({ message }) => expect(message).to.equal('user email is empty or blank'))
        )

        it('should fail on no user password', () =>
            logic.unregisterUser(dummyUserId, userData.email)
                .catch(({ message }) => expect(message).to.equal('user password is not a string'))
        )

        it('should fail on empty user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )

        it('should fail on blank user password', () =>
            logic.unregisterUser(dummyUserId, userData.email, '     ')
                .catch(({ message }) => expect(message).to.equal('user password is empty or blank'))
        )
    })

    

    describe('get castings', () => {
        it('should succeed on correct data', () => {
            const user = new User(userData)
            const proj1= new Project(projects[0])
            const casting1_1= new Casting(projects[0].castings[0])
            const casting1_2= new Casting(projects[0].castings[1])
            
            
            return Promise.all([proj1.save(),casting1_1.save(), casting1_2.save(),user.save()])
                .then(([proj1,cast1_1,cast1_2,user])=>{
                    
                    user.castings.push({project: proj1._id, castings: [cast1_1._id, cast1_2._id ]})
                    return user.save()

                        .then(user=>{
                            
                            return logic.getCastings(user.id)
                            .then(applicationsList => {
                                
                                expect(applicationsList).to.exist
                                expect(applicationsList.length).to.equal(1)
                                
                                expect(applicationsList[0].project._id).to.equal(proj1._id)
                                expect(applicationsList[0].castings.length).to.equal(2)
                                expect(_id).not.to.exist
                                
                            })


                        })

                })
            
            
            
            return user.save()
                .then(({ id: userId, castings }) => {
                })
        })

        it('should fail on non user id', () =>
            logic.getCastings()
                .catch(({ message }) => expect(message).to.equal('user id is not a string'))
        )

        it('should fail on empty user id', () =>
            logic.getCastings('')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )

        it('should fail on blank user id', () =>
            logic.getCastings('      ')
                .catch(({ message }) => expect(message).to.equal('user id is empty or blank'))
        )
    })

    

    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})
