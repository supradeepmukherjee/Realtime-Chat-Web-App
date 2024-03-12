export const uNameValidator = uName => /^[a-zA-Z0-9]+$/.test(uName)

export const passwordValidator = p => {
    if (p.length < 8) return 'Password must be of min. 8 characters'
    if (!(/\d/.test(p))) return 'Password must contain atleast 1 digit'
    // eslint-disable-next-line no-useless-escape
    if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(p))) return 'Password must contain atleast 1 special character'
    if (!(/[A-Z]/).test(p)) return 'Password must contain atleast 1 Capital letter'
    if (!(/[a-z]/).test(p)) return 'Password must contain atleast 1 Small letter'
}