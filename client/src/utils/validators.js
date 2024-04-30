const nameValidator = name => {
    if (!(/^[a-zA-Z]/.test(name))) return 'Please enter correct name'
}

const uNameValidator = uName => {
    if (!(/^[a-zA-Z0-9]+$/.test(uName))) return 'Username must contain only alphanumeric characters'
}

const passwordValidator = p => {
    if (p.length < 8) return 'Password must be of min. 8 characters'
    if (!(/\d/.test(p))) return 'Password must contain atleast 1 digit'
    if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(p))) return 'Password must contain atleast 1 special character'
    if (!(/[A-Z]/).test(p)) return 'Password must contain atleast 1 Capital letter'
    if (!(/[a-z]/).test(p)) return 'Password must contain atleast 1 Small letter'
}

export { nameValidator, passwordValidator, uNameValidator }