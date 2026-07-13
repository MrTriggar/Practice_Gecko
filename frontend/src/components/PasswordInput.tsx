import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './PasswordInput.css'

interface PasswordInputProps {
  name: string
  placeholder?: string
  required?: boolean
  minLength?: number
}

export function PasswordInput({ name, placeholder, required, minLength }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-input">
      <input
        type={visible ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className="password-input__toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}