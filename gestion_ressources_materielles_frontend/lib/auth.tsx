"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type UserRole = "supplier" | "resource-manager" | "teacher" | "department-head" | "technician"

type User = {
  id: string
  name: string
  email: string
  role: UserRole
  profileComplete: boolean
  companyName?: string
  department?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, forceRole?: UserRole) => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkProfileComplete: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Protect routes
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      const publicRoutes = [
        "/login",
        "/register",
        "/login-resource-manager",
        "/login-teacher",
        "/login-technician",
        "/resource-manager",
      ]

      // If no user is logged in and trying to access protected route
      if (!user && !publicRoutes.includes(pathname) && !pathname.startsWith("/resource-manager")) {
        // Redirect to appropriate login page based on the URL path
        if (pathname.startsWith("/resource-manager")) {
          router.push("/resource-manager")
        } else if (pathname.startsWith("/teacher") || pathname.startsWith("/department-head")) {
          router.push("/login-teacher")
        } else if (pathname.startsWith("/technician")) {
          router.push("/login-technician")
        } else {
          router.push("/login")
        }
        return
      }

      // If user is logged in and trying to access login pages
      if (user && publicRoutes.includes(pathname)) {
        if (user.role === "resource-manager") {
          router.push("/resource-manager/department-requests") // Direct to department requests
        } else if (user.role === "teacher") {
          router.push("/teacher/dashboard")
        } else if (user.role === "department-head") {
          router.push("/department-head/dashboard")
        } else if (user.role === "technician") {
          router.push("/technician/dashboard")
        } else {
          router.push("/tenders")
        }
        return
      }

      // If user is logged in but trying to access wrong role's pages
      if (user) {
        if (
          user.role === "supplier" &&
          (pathname.startsWith("/resource-manager") ||
            pathname.startsWith("/teacher") ||
            pathname.startsWith("/department-head") ||
            pathname.startsWith("/technician"))
        ) {
          router.push("/dashboard")
        } else if (
          user.role === "resource-manager" &&
          (pathname.startsWith("/teacher") ||
            pathname.startsWith("/department-head") ||
            pathname.startsWith("/technician") ||
            (!pathname.startsWith("/resource-manager") && !publicRoutes.includes(pathname)))
        ) {
          router.push("/resource-manager/department-requests")
        } else if (
          user.role === "teacher" &&
          (pathname.startsWith("/resource-manager") ||
            pathname.startsWith("/department-head") ||
            pathname.startsWith("/technician") ||
            (!pathname.startsWith("/teacher") && !publicRoutes.includes(pathname)))
        ) {
          router.push("/teacher/dashboard")
        } else if (
          user.role === "department-head" &&
          (pathname.startsWith("/resource-manager") ||
            pathname.startsWith("/technician") ||
            pathname.startsWith("/teacher") ||
            (!pathname.startsWith("/department-head") && !publicRoutes.includes(pathname)))
        ) {
          router.push("/department-head/dashboard")
        } else if (
          user.role === "technician" &&
          (pathname.startsWith("/resource-manager") ||
            pathname.startsWith("/teacher") ||
            pathname.startsWith("/department-head") ||
            (!pathname.startsWith("/technician") && !publicRoutes.includes(pathname)))
        ) {
          router.push("/technician/dashboard")
        }
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string, forceRole?: UserRole) => {
    // In a real app, this would be an API call
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Determine role based on login page or email for demo purposes
    // If forceRole is provided, use that instead
    let role: UserRole = forceRole || "supplier"

    if (!forceRole) {
      if (pathname === "/resource-manager" || email.includes("resource") || email.includes("manager")) {
        role = "resource-manager"
      } else if (pathname === "/login-teacher") {
        // For teacher login page, check if it's a department head based on email
        if (email.startsWith("head-") || email.includes("admin") || email.includes("chef")) {
          role = "department-head"
        } else {
          role = "teacher"
        }
      } else if (pathname === "/login-technician" || email.includes("tech-")) {
        role = "technician"
      }
    }

    // Use a deterministic ID based on email instead of random
    const userId = `usr_${email.replace(/[^a-z0-9]/gi, "").substring(0, 9)}`

    // Mock user data
    const mockUser: User = {
      id: userId,
      name: email.split("@")[0].replace("tech-", ""),
      email,
      role,
      profileComplete: true, // Set to true for testing purposes
      ...(role === "resource-manager"
        ? { department: "Service des ressources" }
        : role === "teacher" || role === "department-head"
          ? { department: "Département d'informatique" }
          : role === "technician"
            ? { department: "Service technique" }
            : { companyName: email.split("@")[0].replace("tech-", "") + " Inc." }),
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    setIsLoading(false)

    // Redirect based on role
    if (mockUser.role === "resource-manager") {
      router.push("/resource-manager/department-requests")
    } else if (mockUser.role === "teacher") {
      router.push("/teacher/dashboard")
    } else if (mockUser.role === "department-head") {
      router.push("/department-head/dashboard")
    } else if (mockUser.role === "technician") {
      router.push("/technician/dashboard")
    } else {
      router.push("/tenders")
    }
  }

  const register = async (name: string, email: string, password: string, role: UserRole = "supplier") => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Use a deterministic ID based on email instead of random
    const userId = `usr_${email.replace(/[^a-z0-9]/gi, "").substring(0, 9)}`

    // Mock user data
    const mockUser: User = {
      id: userId,
      name,
      email,
      role,
      profileComplete: true, // Set to true for testing purposes
      ...(role === "resource-manager"
        ? { department: "Service des ressources" }
        : role === "teacher" || role === "department-head"
          ? { department: "Département d'informatique" }
          : { companyName: name + " Inc." }),
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    setIsLoading(false)

    // Redirect based on role
    if (mockUser.role === "resource-manager") {
      router.push("/resource-manager/department-requests")
    } else if (mockUser.role === "teacher") {
      router.push("/teacher/dashboard")
    } else if (mockUser.role === "department-head") {
      router.push("/department-head/dashboard")
    } else {
      router.push("/tenders")
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")

    // Redirect to appropriate login page based on current path
    if (pathname.startsWith("/resource-manager")) {
      router.push("/resource-manager")
    } else if (pathname.startsWith("/teacher") || pathname.startsWith("/department-head")) {
      router.push("/login-teacher")
    } else if (pathname.startsWith("/technician")) {
      router.push("/login-technician")
    } else {
      router.push("/login")
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const checkProfileComplete = () => {
    if (!user) return false

    if (!user.profileComplete) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez compléter votre profil avant de continuer.",
        variant: "destructive",
      })

      if (user.role === "resource-manager") {
        router.push("/resource-manager/profile")
      } else if (user.role === "teacher") {
        router.push("/teacher/profile")
      } else if (user.role === "department-head") {
        router.push("/department-head/profile")
      } else if (user.role === "technician") {
        router.push("/technician/profile")
      } else {
        router.push("/profile")
      }
      return false
    }

    return true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        checkProfileComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
