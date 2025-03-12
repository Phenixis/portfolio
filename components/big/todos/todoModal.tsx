import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Todo } from "@/lib/db/schema"
import { PlusIcon, PenIcon } from "lucide-react"

export function TodoModal({ className, todo }: { className?: string, todo?: Todo }) {
    const mode = todo ? 'edit' : 'create';

    return (
        <Dialog>
            <DialogTrigger className={className}>
                {
                    mode === 'edit' ? (
                        <PenIcon className="size-4" />
                    ) : (
                        <PlusIcon className="size-6" />
                    )
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            mode === 'edit' ? (
                                'Edit Todo'
                            ) : (
                                'Create Todo'
                            )
                        }
                    </DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                    <div>
                        <Label htmlFor="title">
                            Title
                        </Label>
                        <Input type="text" name="title" defaultValue={todo ? todo.title : ''} />
                    </div>
                    <div className="flex space-x-4">
                        <div>
                            <Label htmlFor="importance">
                                Importance
                            </Label>
                            <Input type="number" name="importance" defaultValue={todo ? todo.importance : 0} min={0} max={5} />
                        </div>
                        <div>
                            <Label htmlFor="urgency">
                                Urgency
                            </Label>
                            <Input type="text" name="urgency" defaultValue={todo ? todo.urgency : 0} min={0} max={5} />
                        </div>
                        <div>
                            <Label htmlFor="duration">
                                Duration
                            </Label>
                            <Input type="text" name="duration" defaultValue={todo ? todo.duration : 0} min={0} max={3} />
                        </div>
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <Button type="submit">
                        {
                            mode === 'edit' ? (
                                'Save'
                            ) : (
                                'Create'
                            )
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}