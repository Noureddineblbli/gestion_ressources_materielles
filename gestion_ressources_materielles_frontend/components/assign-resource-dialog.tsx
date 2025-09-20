"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Department {
  id: string
  name: string
  people: Person[]
}

interface Person {
  id: string
  name: string
  title: string
}

// Sample departments and people data
const departments: Department[] = [
  {
    id: "math",
    name: "Mathematics",
    people: [
      { id: "p1", name: "Dr. Sarah Wilson", title: "Associate Professor" },
      { id: "p2", name: "Dr. Michael Brown", title: "Professor" },
      { id: "p3", name: "Dr. Emily Johnson", title: "Assistant Professor" },
    ],
  },
  {
    id: "cs",
    name: "Computer Science",
    people: [
      { id: "p4", name: "Dr. John Smith", title: "Professor" },
      { id: "p5", name: "Dr. Lisa Chen", title: "Associate Professor" },
      { id: "p6", name: "Dr. Robert Davis", title: "Assistant Professor" },
    ],
  },
  {
    id: "physics",
    name: "Physics Department",
    people: [
      { id: "p7", name: "Dr. James Miller", title: "Professor" },
      { id: "p8", name: "Dr. Patricia White", title: "Associate Professor" },
      { id: "p9", name: "Dr. Thomas Lee", title: "Assistant Professor" },
    ],
  },
]

interface AssignResourceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resource: {
    id: string
    name: string
    type: string
    brand: string
    status?: string
  } | null
  onAssign: (assignment: {
    resourceId: string
    departmentId: string
    personId?: string
    assignToEntireDepartment: boolean
  }) => void
}

export function AssignResourceDialog({ open, onOpenChange, resource, onAssign }: AssignResourceDialogProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [assignmentType, setAssignmentType] = useState<"department" | "person">("person")
  const [selectedPerson, setSelectedPerson] = useState<string>("")

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    setSelectedPerson("")
  }

  const handleAssign = () => {
    if (!resource || !selectedDepartment) return

    onAssign({
      resourceId: resource.id,
      departmentId: selectedDepartment,
      personId: assignmentType === "person" ? selectedPerson : undefined,
      assignToEntireDepartment: assignmentType === "department",
    })

    onOpenChange(false)
  }

  const selectedDepartmentData = departments.find((dept) => dept.id === selectedDepartment)

  if (!resource) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {resource.status === "Assigné" ? "Modifier l'assignation" : "Assigner une ressource"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {resource.status === "Assigné"
              ? "Modifiez l'assignation de cette ressource."
              : "Assignez cette ressource à un département ou à une personne spécifique."}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Resource Info */}
          <div>
            <h3 className="font-medium">{resource.name}</h3>
            <div className="text-sm text-muted-foreground flex gap-2">
              <span>{resource.type}</span>
              <span>•</span>
              <span>{resource.brand}</span>
            </div>
            <div className="text-sm mt-1">
              N° d'inventaire: <span className="font-medium">{resource.id}</span>
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assignment Type */}
          <div className="space-y-3">
            <Label>Type d'assignation</Label>
            <RadioGroup
              value={assignmentType}
              onValueChange={(value) => setAssignmentType(value as "department" | "person")}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioItem value="department" id="department-radio" className="h-4 w-4 rounded-full" />
                <Label htmlFor="department-radio" className="cursor-pointer">
                  Assigner au département entier
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioItem value="person" id="person-radio" className="h-4 w-4 rounded-full" />
                <Label htmlFor="person-radio" className="cursor-pointer">
                  Assigner à une personne spécifique
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Person Selection */}
          {assignmentType === "person" && selectedDepartment && (
            <div className="space-y-2">
              <Label htmlFor="person">Personne</Label>
              <Select value={selectedPerson} onValueChange={setSelectedPerson}>
                <SelectTrigger id="person">
                  <SelectValue placeholder="Sélectionner une personne" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDepartmentData?.people.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name} ({person.title})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Liste des enseignants du département sélectionné</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-black hover:bg-black/80 text-white"
            onClick={handleAssign}
            disabled={!selectedDepartment || (assignmentType === "person" && !selectedPerson)}
          >
            Assigner la ressource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
