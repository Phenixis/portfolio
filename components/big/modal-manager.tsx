"use client"

import TaskModal from "@/components/big/tasks/task-modal"
import NoteModal from "@/components/big/notes/note-modal"
import DailyMoodModal from "@/components/big/dailyMood/dailyMood-modal"
import { useTaskModal, useNoteModal, useDailyMoodModal } from "@/contexts/modal-commands-context"

export default function ModalManager() {
    const taskModal = useTaskModal()
    const noteModal = useNoteModal()
    const dailyMoodModal = useDailyMoodModal()

    return (
        <>
            <TaskModal
                isOpen={taskModal.isOpen}
                onOpenChange={(open) => open ? taskModal.openModal() : taskModal.closeModal()}
            >
                <div style={{ display: 'none' }} />
            </TaskModal>
            <NoteModal
                isOpen={noteModal.isOpen}
                onOpenChange={(open) => open ? noteModal.openModal() : noteModal.closeModal()}
                note={noteModal.note}
                password={noteModal.password}
            >
                <div style={{ display: 'none' }} />
            </NoteModal>
            <DailyMoodModal
                isOpen={dailyMoodModal.isOpen}
                onOpenChange={(open) => open ? dailyMoodModal.openModal() : dailyMoodModal.closeModal()}
                date={dailyMoodModal.date}
            >
                <div style={{ display: 'none' }} />
            </DailyMoodModal>
        </>
    )
}
