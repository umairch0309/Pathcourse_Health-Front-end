'use client'

import { useEffect, useState } from 'react'
import { Loader } from '@/components/loader'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import useApi from '@/hooks/use-api'
import { useFetch } from '@/hooks/use-fetch'
import type { AppointmentForDetails } from './tabs'

type AppointmentNotes = {
  id: string
  appointmentId: string
  doctorId: string
  notes: string
  createdAt: string
  updatedAt: string
}

type NotesProps = {
  appointment: AppointmentForDetails
}

export default function Notes({ appointment }: NotesProps) {
  const [notesDraft, setNotesDraft] = useState('')

  const {
    data: notesData,
    isLoading,
    error,
    refetch,
  } = useFetch<AppointmentNotes>({
    path: `/api/appointment/${appointment.id}/notes`,
    queryKey: ['appointment-notes', appointment.id],
    config: {
      retry: false,
    },
  })

  useEffect(() => {
    if (notesData?.notes) {
      setNotesDraft(notesData.notes)
    } else if (error && (error as any)?.response?.status === 404) {
      setNotesDraft('')
    }
  }, [notesData, error])

  const {
    onRequest: saveNotes,
    isPending,
  } = useApi<{ notes: string }>({
    key: 'appointment-notes',
    method: 'post',
    showSuccessToast: true,
    showErrorToast: true,
  })

  const handleSave = () => {
    if (!notesDraft.trim()) return

    saveNotes({
      path: `/api/appointment/${appointment.id}/notes`,
      data: { notes: notesDraft },
      onSuccess: async () => {
        await refetch()
      },
    })
  }

  const is404 = (error as any)?.response?.status === 404

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Typography variant="h6" className="font-semibold text-foreground">
          Appointment Notes
        </Typography>
        <Typography variant="p" className="text-xs text-muted-foreground">
          These notes are internal and only visible to doctors. Patients can never
          see them.
        </Typography>
      </div>

      {isLoading && !notesData && !error && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader size="sm" />
          <span>Loading notes...</span>
        </div>
      )}

      {error && !is404 && (
        <Typography variant="p" className="text-sm text-red-500">
          Failed to load existing notes. You can still create or update notes
          below.
        </Typography>
      )}

      <Textarea
        value={notesDraft}
        onChange={(e) => setNotesDraft(e.target.value)}
        rows={10}
        className="resize-none text-sm"
        placeholder="Write your internal notes for this appointment..."
      />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => setNotesDraft(notesData?.notes || '')}
        >
          Reset
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isPending || !notesDraft.trim()}
          onClick={handleSave}
        >
          {isPending ? <Loader size="sm" color="white" /> : 'Save Notes'}
        </Button>
      </div>
    </div>
  )
}

