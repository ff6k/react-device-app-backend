const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

const jwtConfig = {
	secret: 'some-secret-code-goes-here',
	expiresIn: '2 days' // A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc)
};

module.exports = {
    authenticate,
    authenticatewithtoken,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    deleteByIds: deleteByIds,
    deleteByEmail: deleteByEmail,
};

async function authenticate({ email, password }) {  
    try {
        const user = await User.findOne({ email: email });

        if (user && bcrypt.compareSync(password, user.password)) {
            const access_token = jwt.sign({ id: user.uuid }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

            return {
                user: {
                    id: user.id,
                    uuid: user.uuid,
                    from: 'custom-db',
                    role: user.role,
                    data: {
                        displayName: user.displayName,
                        photoURL: '$2a$10$Nmu3H4fs1f/rFZKANn8SLeZuz5bGix/nLog5GJpvvASJ6/RtAgsEa',
                        email: user.email,
                        phone: user.phone,
                        active: user.active,
                        settings: {
                            layout: {
                                style: 'layout1',
                                config: {
                                    scroll: 'content',
                                    navbar: {
                                        display: true,
                                        folded: true,
                                        position: 'left'
                                    },
                                    toolbar: {
                                        display: true,
                                        style: 'fixed',
                                        position: 'below'
                                    },
                                    footer: {
                                        display: true,
                                        style: 'fixed',
                                        position: 'below'
                                    },
                                    mode: 'fullwidth'
                                }
                            },
                            customScrollbars: true,
                            theme: {
                                main: 'defaultDark',
                                navbar: 'defaultDark',
                                toolbar: 'defaultDark',
                                footer: 'defaultDark'
                            }
                        },
                        shortcuts: ['calendar', 'mail', 'contacts']
                    },
                },
                access_token
            };
        }
    } catch (e) {
		const error = 'Invalid access token detected';
		return [401, { error }];
	}
}

async function authenticatewithtoken({ access_token }) { 
    try {
		const { id } = jwt.verify(access_token, jwtConfig.secret); 

		const user = await User.findOne({ uuid: id });

		const updatedAccessToken = jwt.sign({ id: user.uuid }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
                             
		return {
            user: {
                id: user.id,
                uuid: user.uuid,
                from: 'custom-db',
                role: user.role,
                data: {
                    displayName: user.displayName,
                    photoURL: '$2a$10$Nmu3H4fs1f/rFZKANn8SLeZuz5bGix/nLog5GJpvvASJ6/RtAgsEa',
                    email: user.email,
                    phone: user.phone,
                    active: user.active,
                    settings: {
                        layout: {
                            style: 'layout1',
                            config: {
                                scroll: 'content',
                                navbar: {
                                    display: true,
                                    folded: true,
                                    position: 'left'
                                },
                                toolbar: {
                                    display: true,
                                    style: 'fixed',
                                    position: 'below'
                                },
                                footer: {
                                    display: true,
                                    style: 'fixed',
                                    position: 'below'
                                },
                                mode: 'fullwidth'
                            }
                        },
                        customScrollbars: true,
                        theme: {
                            main: 'defaultDark',
                            navbar: 'defaultDark',
                            toolbar: 'defaultDark',
                            footer: 'defaultDark'
                        }
                    },
                    shortcuts: ['calendar', 'mail', 'contacts']
                },
            },
            access_token: updatedAccessToken
		};
	} catch (e) {
		const error = 'Invalid access token detected';
		return [401, { error }];
	}
    
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function deleteByIds(ids) { 
    ids.map(async id => {
        await User.findByIdAndRemove(id);
    })    
}

async function deleteByEmail(email) { 
    await User.deleteOne({ email: email });
}