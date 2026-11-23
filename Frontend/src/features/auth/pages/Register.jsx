
import React, { useState } from 'react'
import { Link } from "react-router-dom"
import axios from "axios"

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        {
          username,
          email,
          password
        },
        {
          withCredentials: true
        }
      )

      console.log("Registration successful:", response.data)

      alert("Registration successful! Please check your email for verification.")

      setUsername('')
      setEmail('')
      setPassword('')

    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      )

      alert(
        error.response?.data?.err ||
        error.response?.data?.message ||
        "Registration failed. Please try again."
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-neutral-950 to-red-950">
      <div className="w-full max-w-md rounded-2xl border border-red-900/40 bg-neutral-950/80 p-8 shadow-2xl shadow-red-950/50 backdrop-blur">

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-500">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-neutral-400">
          Sign up with a username, email and password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-neutral-300">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-neutral-100 placeholder-neutral-600 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/40"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-neutral-300">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-neutral-100 placeholder-neutral-600 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/40"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-neutral-300">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-neutral-100 placeholder-neutral-600 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-600/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-red-700 via-red-600 to-rose-500 py-2.5 font-semibold text-white shadow-lg shadow-red-900/40 transition hover:from-red-600 hover:to-orange-500 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-red-500 hover:text-red-400">
            Log in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
