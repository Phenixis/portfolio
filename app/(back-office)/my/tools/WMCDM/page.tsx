"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Plus, Save, Download, Upload, FileUp, Edit, Info, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Types definition for our WMCDM components
type Option = {
    id: string;
    name: string;
    scores: Record<string, number>;
};

type Criterion = {
    id: string;
    name: string;
    weight: number;
    description: string;
};

type DecisionMatrix = {
    criteria: Criterion[];
    options: Option[];
};

export default function Page() {
    // State for the decision matrix - simplified to just criteria and options
    const [matrix, setMatrix] = useState<DecisionMatrix>({
        criteria: [],
        options: []
    });
    
    // State for new criterion or option
    const [newCriterionName, setNewCriterionName] = useState("");
    const [newCriterionWeight, setNewCriterionWeight] = useState(1);
    const [newCriterionDescription, setNewCriterionDescription] = useState("");
    const [newOptionName, setNewOptionName] = useState("");
    
    // State for editing criterion
    const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(null);
    const [showCriterionDialog, setShowCriterionDialog] = useState(false);

    // Function to add a new criterion
    const addCriterion = () => {
        if (!newCriterionName) {
            toast.error("Criterion name cannot be empty");
            return;
        }
        
        const newCriterion: Criterion = {
            id: `criterion-${Date.now()}`,
            name: newCriterionName,
            weight: newCriterionWeight,
            description: newCriterionDescription
        };
        
        setMatrix(prev => {
            // Add the criterion
            const updatedMatrix = {
                ...prev,
                criteria: [...prev.criteria, newCriterion]
            };
            
            // Add this criterion to each existing option with a default score of 0
            updatedMatrix.options = updatedMatrix.options.map(option => ({
                ...option,
                scores: {
                    ...option.scores,
                    [newCriterion.id]: 0
                }
            }));
            
            return updatedMatrix;
        });
        
        // Reset the form fields
        setNewCriterionName("");
        setNewCriterionWeight(1);
        setNewCriterionDescription("");
        
        toast.success("Criterion added successfully");
    };
    
    // Function to update a criterion
    const updateCriterion = () => {
        if (!editingCriterion || !editingCriterion.name) {
            toast.error("Criterion name cannot be empty");
            return;
        }

        setMatrix(prev => {
            const updatedCriteria = prev.criteria.map(criterion => 
                criterion.id === editingCriterion.id ? editingCriterion : criterion
            );
            
            return {
                ...prev,
                criteria: updatedCriteria
            };
        });
        
        setEditingCriterion(null);
        setShowCriterionDialog(false);
        toast.success("Criterion updated successfully");
    };
    
    // Function to add a new option
    const addOption = () => {
        if (!newOptionName) {
            toast.error("Option name cannot be empty");
            return;
        }
        
        const newOption: Option = {
            id: `option-${Date.now()}`,
            name: newOptionName,
            scores: {}
        };
        
        // Initialize scores for each criterion
        matrix.criteria.forEach(criterion => {
            newOption.scores[criterion.id] = 0;
        });
        
        setMatrix(prev => ({
            ...prev,
            options: [...prev.options, newOption]
        }));
        
        // Reset the form field
        setNewOptionName("");
        
        toast.success("Option added successfully");
    };
    
    // Function to update a score
    const updateScore = (optionId: string, criterionId: string, score: number) => {
        // Make sure the score is between 0 and 10
        const validScore = Math.min(Math.max(score, 0), 10);
        
        setMatrix(prev => {
            const updatedOptions = prev.options.map(option => {
                if (option.id === optionId) {
                    return {
                        ...option,
                        scores: {
                            ...option.scores,
                            [criterionId]: validScore
                        }
                    };
                }
                return option;
            });
            
            return {
                ...prev,
                options: updatedOptions
            };
        });
    };
    
    // Function to remove a criterion
    const removeCriterion = (criterionId: string) => {
        setMatrix(prev => {
            // Remove the criterion
            const updatedCriteria = prev.criteria.filter(c => c.id !== criterionId);
            
            // Remove this criterion's scores from all options
            const updatedOptions = prev.options.map(option => {
                const { [criterionId]: removed, ...remainingScores } = option.scores;
                return {
                    ...option,
                    scores: remainingScores
                };
            });
            
            return {
                ...prev,
                criteria: updatedCriteria,
                options: updatedOptions
            };
        });
        
        toast.success("Criterion removed successfully");
    };
    
    // Function to remove an option
    const removeOption = (optionId: string) => {
        setMatrix(prev => ({
            ...prev,
            options: prev.options.filter(o => o.id !== optionId)
        }));
        
        toast.success("Option removed successfully");
    };
    
    /**
     * Calculate weighted scores for each option and criterion
     * @returns Record of weighted scores for each option and criterion
     */
    const calculateWeightedScores = () => {
        // Calculate weighted score for each option and criterion
        const weightedScores: Record<string, Record<string, number>> = {};
        
        matrix.options.forEach(option => {
            weightedScores[option.id] = {};
            matrix.criteria.forEach(criterion => {
                const score = option.scores[criterion.id] || 0;
                const weightedScore = score * criterion.weight;
                weightedScores[option.id][criterion.id] = weightedScore;
            });
        });
        
        return weightedScores;
    };
    
    /**
     * Calculate totals for each option
     * @returns Record containing total and normalized scores for each option
     */
    const calculateTotals = () => {
        const weightedScores = calculateWeightedScores();
        const totals: Record<string, { total: number, normalized: number }> = {};
        const totalWeight = matrix.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
        
        matrix.options.forEach(option => {
            const total = Object.values(weightedScores[option.id]).reduce((sum, score) => sum + score, 0);
            // Normalize to a score out of 10
            const normalized = totalWeight > 0 ? (total / totalWeight) * 10 : 0;
            
            totals[option.id] = { 
                total,
                normalized: parseFloat(normalized.toFixed(1))
            };
        });
        
        return totals;
    };
    
    /**
     * Find the winner option for a specific criterion
     * @param criterionId The ID of the criterion to evaluate
     * @returns The winning option or null if no options
     */
    const findWinnerForCriterion = (criterionId: string): Option | null => {
        if (matrix.options.length === 0) return null;
        
        return matrix.options.reduce((winner, current) => {
            const currentScore = current.scores[criterionId] || 0;
            const winnerScore = winner ? (winner.scores[criterionId] || 0) : -1;
            
            return currentScore > winnerScore ? current : winner;
        }, null as Option | null);
    };
    
    // Save decision matrix to local storage
    const saveMatrix = () => {
        try {
            localStorage.setItem("decisionMatrix", JSON.stringify(matrix));
            toast.success("Decision matrix saved successfully");
        } catch (error) {
            console.error("Error saving matrix:", error);
            toast.error("Failed to save decision matrix");
        }
    };
    
    // Load decision matrix from local storage
    const loadMatrix = () => {
        try {
            const savedMatrix = localStorage.getItem("decisionMatrix");
            if (savedMatrix) {
                setMatrix(JSON.parse(savedMatrix));
                toast.success("Decision matrix loaded successfully");
            } else {
                toast.error("No saved matrix found");
            }
        } catch (error) {
            console.error("Error loading matrix:", error);
            toast.error("Failed to load decision matrix");
        }
    };
    
    // Export matrix as JSON file
    const exportMatrix = () => {
        const dataStr = JSON.stringify(matrix, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `wmcdm-matrix-${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
        
        toast.success("Matrix exported successfully");
    };
    
    // Import matrix from JSON file
    const importMatrix = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedMatrix = JSON.parse(e.target?.result as string);
                if (
                    importedMatrix && 
                    typeof importedMatrix === 'object' && 
                    'criteria' in importedMatrix && 
                    'options' in importedMatrix
                ) {
                    setMatrix(importedMatrix);
                    toast.success("Matrix imported successfully");
                } else {
                    toast.error("Invalid matrix format");
                }
            } catch (error) {
                console.error("Error parsing imported file:", error);
                toast.error("Failed to import matrix");
            }
        };
        reader.readAsText(file);
    };
    
    // Reset the entire matrix
    const resetMatrix = () => {
        setMatrix({
            criteria: [],
            options: []
        });
        toast.success("Matrix reset successfully");
    };

    // Calculate weighted scores and totals
    const weightedScores = calculateWeightedScores();
    const totals = calculateTotals();
    const totalWeight = matrix.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    
    // Find the best overall option (highest normalized score)
    const bestOption = matrix.options.length > 0 
        ? matrix.options.reduce((best, current) => {
            const currentScore = totals[current.id]?.normalized || 0;
            const bestScore = best ? totals[best.id]?.normalized || 0 : -1;
            return currentScore > bestScore ? current : best;
        }, null as Option | null)
        : null;
    
    // Sort criteria by their weight in descending order
    const sortedCriteria = [...matrix.criteria].sort((a, b) => b.weight - a.weight);
    
    // Sort options by their name alphabetically for consistent ordering
    const sortedOptions = [...matrix.options].sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    return (
        <div className="container mx-auto py-8 space-y-8">
            <section className="page">
                <h1 className="page-title">Weighted Multi-Criteria Decision Matrix</h1>
                <p className="page-description">
                    A decision-making tool that helps evaluate multiple options against various criteria, 
                    with each criterion having a different level of importance (weight).
                </p>
            </section>

            <div className="flex flex-wrap gap-4 justify-between mb-8">
                <div className="flex flex-wrap gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Criterion
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Criterion</DialogTitle>
                                <DialogDescription>
                                    Define a criterion for evaluating your options.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="criterion-name">Criterion Name</Label>
                                    <Input
                                        id="criterion-name"
                                        value={newCriterionName}
                                        onChange={(e) => setNewCriterionName(e.target.value)}
                                        placeholder="e.g., Cost, Quality, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="criterion-weight">Weight (1-5)</Label>
                                    <Select
                                        value={newCriterionWeight.toString()}
                                        onValueChange={(value) => setNewCriterionWeight(parseInt(value))}
                                    >
                                        <SelectTrigger id="criterion-weight">
                                            <SelectValue placeholder="Weight" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Least Important</SelectItem>
                                            <SelectItem value="2">2 - Somewhat Important</SelectItem>
                                            <SelectItem value="3">3 - Important</SelectItem>
                                            <SelectItem value="4">4 - Very Important</SelectItem>
                                            <SelectItem value="5">5 - Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="criterion-description">Description (Optional)</Label>
                                    <Textarea
                                        id="criterion-description"
                                        value={newCriterionDescription}
                                        onChange={(e) => setNewCriterionDescription(e.target.value)}
                                        placeholder="Describe what this criterion means..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={addCriterion}>Add Criterion</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Option
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Option</DialogTitle>
                                <DialogDescription>
                                    Add an option to evaluate against your criteria.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="option-name">Option Name</Label>
                                    <Input
                                        id="option-name"
                                        value={newOptionName}
                                        onChange={(e) => setNewOptionName(e.target.value)}
                                        placeholder="e.g., Option A, Plan 1, etc."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={addOption}>Add Option</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button onClick={saveMatrix} variant="outline" className="flex items-center">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button onClick={loadMatrix} variant="outline" className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" /> Load
                    </Button>
                    <Button onClick={exportMatrix} variant="outline" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <div className="relative">
                        <Button variant="outline" className="flex items-center" onClick={() => document.getElementById('import-file')?.click()}>
                            <FileUp className="mr-2 h-4 w-4" /> Import
                        </Button>
                        <Input
                            id="import-file"
                            type="file"
                            accept=".json"
                            onChange={importMatrix}
                            className="hidden"
                        />
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Reset</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Reset Matrix</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to reset the decision matrix? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={resetMatrix}>Reset</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Edit Criterion Dialog */}
            <Dialog open={showCriterionDialog} onOpenChange={setShowCriterionDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Criterion</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {editingCriterion && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-criterion-name">Criterion Name</Label>
                                    <Input
                                        id="edit-criterion-name"
                                        value={editingCriterion.name}
                                        onChange={(e) => setEditingCriterion({...editingCriterion, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-criterion-weight">Weight (1-5)</Label>
                                    <Select
                                        value={editingCriterion.weight.toString()}
                                        onValueChange={(value) => setEditingCriterion({
                                            ...editingCriterion, 
                                            weight: parseInt(value)
                                        })}
                                    >
                                        <SelectTrigger id="edit-criterion-weight">
                                            <SelectValue placeholder="Weight" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 - Least Important</SelectItem>
                                            <SelectItem value="2">2 - Somewhat Important</SelectItem>
                                            <SelectItem value="3">3 - Important</SelectItem>
                                            <SelectItem value="4">4 - Very Important</SelectItem>
                                            <SelectItem value="5">5 - Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-criterion-description">Description</Label>
                                    <Textarea
                                        id="edit-criterion-description"
                                        value={editingCriterion.description}
                                        onChange={(e) => setEditingCriterion({
                                            ...editingCriterion, 
                                            description: e.target.value
                                        })}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCriterionDialog(false)}>Cancel</Button>
                        <Button onClick={updateCriterion}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main Decision Matrix Table */}
            {matrix.criteria.length > 0 || matrix.options.length > 0 ? (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Decision Matrix</CardTitle>
                        <CardDescription>
                            Score each option against each criterion (0-10). Options are sorted from least to most interesting based on weighted scores.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-x-auto">
                        <div className="w-full min-w-full">
                            <Table className="w-full table-fixed">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px] min-w-[180px]">Criteria</TableHead>
                                        <TableHead className="w-[80px] min-w-[80px] text-center">Weight</TableHead>
                                        {sortedOptions.map(option => (
                                            <TableHead 
                                                key={option.id} 
                                                className="text-center min-w-[120px] group/Option"
                                                style={{ width: `${sortedOptions.length > 0 ? (100 - 25) / sortedOptions.length : 0}%` }}
                                            >
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="truncate">{option.name}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOption(option.id)}
                                                        className="h-7 w-7 p-0 lg:opacity-0 lg:group-hover/Option:opacity-100 transition-opacity duration-200 flex-shrink-0"
                                                        aria-label={`Remove ${option.name}`}
                                                    >
                                                        <Trash className="h-3.5 w-3.5 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-center min-w-[120px] w-[120px]">
                                            Winner
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedCriteria.map(criterion => {
                                        const winner = findWinnerForCriterion(criterion.id);
                                        return (
                                            <TableRow key={criterion.id}>
                                                <TableCell className="font-medium group/Criterion">
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            {criterion.name}
                                                            {criterion.description && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="inline ml-1 h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="max-w-[300px] text-xs">
                                                                        {criterion.description}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-1 lg:group-hover/Criterion:opacity-100 lg:opacity-0 transition-opacity duration-200">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setEditingCriterion(criterion);
                                                                    setShowCriterionDialog(true);
                                                                }}
                                                                className="h-7 w-7 p-0"
                                                                aria-label={`Edit ${criterion.name}`}
                                                            >
                                                                <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeCriterion(criterion.id)}
                                                                className="h-7 w-7 p-0"
                                                                aria-label={`Remove ${criterion.name}`}
                                                            >
                                                                <Trash className="h-3.5 w-3.5 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-bold">
                                                    {criterion.weight}
                                                </TableCell>
                                                
                                                {sortedOptions.map(option => {
                                                    const score = option.scores[criterion.id] || 0;
                                                    const weightedScore = weightedScores[option.id]?.[criterion.id] || 0;
                                                    const isWinner = winner && winner.id === option.id && score > 0;
                                                    
                                                    return (
                                                        <TableCell 
                                                            key={`${criterion.id}-${option.id}`} 
                                                            className={cn(
                                                                "text-center",
                                                                isWinner && "bg-green-50 dark:bg-green-900/20"
                                                            )}
                                                        >
                                                            <div className="flex flex-col items-center">
                                                                <Select
                                                                    value={score.toString()}
                                                                    onValueChange={(value) => updateScore(option.id, criterion.id, parseInt(value))}
                                                                >
                                                                    <SelectTrigger className="h-8 w-14">
                                                                        <SelectValue placeholder="0" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {[...Array(11)].map((_, i) => (
                                                                            <SelectItem key={i} value={i.toString()}>
                                                                                {i}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span className="text-xs text-muted-foreground mt-1">
                                                                    {weightedScore.toFixed(1)}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                                
                                                {/* Winner for this criterion */}
                                                <TableCell className="text-center">
                                                    {winner && winner.scores[criterion.id] > 0 ? (
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-semibold">{winner.name}</span>
                                                            <div className="flex items-center text-xs text-amber-600 dark:text-amber-500">
                                                                <Trophy className="h-3 w-3 mr-1" />
                                                                <span>{winner.scores[criterion.id]}</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">No winner</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    
                                    {/* Total row */}
                                    <TableRow className="border-t-2">
                                        <TableCell className="font-medium">Total</TableCell>
                                        <TableCell className="text-center">{totalWeight}</TableCell>
                                        
                                        {sortedOptions.map(option => (
                                            <TableCell key={`total-${option.id}`} className="text-center font-bold">
                                                {totals[option.id]?.total.toFixed(1)}
                                            </TableCell>
                                        ))}
                                        
                                        <TableCell className="text-center">
                                            {bestOption && (
                                                <div className="flex flex-col items-center">
                                                    <span className="font-semibold">{bestOption.name}</span>
                                                    <div className="text-xs text-muted-foreground">Best overall</div>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    
                                    {/* Normalized score row */}
                                    <TableRow>
                                        <TableCell className="font-medium">Score (0-10)</TableCell>
                                        <TableCell></TableCell>
                                        
                                        {sortedOptions.map((option) => (
                                            <TableCell 
                                                key={`normalized-${option.id}`} 
                                                className={cn(
                                                    "text-center font-bold",
                                                    bestOption && option.id === bestOption.id && "text-green-600 dark:text-green-500"
                                                )}
                                            >
                                                {totals[option.id]?.normalized.toFixed(1)}
                                            </TableCell>
                                        ))}
                                        
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Legend: </span>
                            The top value in each cell is the raw score (0-10) and the bottom value is the weighted score.
                            Criteria are sorted by weight importance (highest first) and options alphabetically.
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <Card className="w-full">
                    <CardContent className="p-8">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">No criteria or options yet</h3>
                            <p className="text-muted-foreground">Add criteria and options to build your decision matrix.</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}