'use client'

import { SessionProvider } from "next-auth/react"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode // fixed typo here
}

const Providers = (props: Props) => {
  return <SessionProvider>{props.children}</SessionProvider> // and here
}

export default Providers
