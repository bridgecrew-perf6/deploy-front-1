

export default function Inputs({ type, name, label, id, value, handleChangeForm }) {
    return (
        <>
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                name={name}
                id={id}
                value={value}
                onChange={(e) => handleChangeForm(e)}
            />
        </>
    )
}