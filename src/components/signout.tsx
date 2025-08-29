"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })} // redirect after sign out
      className="px-4 py-2 rounded bg-red-500 text-white"
    >
      Sign Out
    </button>
  )
}
