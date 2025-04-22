"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  CSSProperties,
} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  GripVertical,
  Plus,
  Search,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "inactive" | "pending";
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    createdAt: "2024-01-20",
    updatedAt: "2024-02-15",
    status: "active",
  },
  {
    id: "2",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    createdAt: "2023-11-01",
    updatedAt: "2024-02-20",
    status: "inactive",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-22",
    status: "pending",
  },
  {
    id: "4",
    name: "Diana Miller",
    email: "diana.miller@example.com",
    createdAt: "2023-10-15",
    updatedAt: "2024-02-25",
    status: "active",
  },
  {
    id: "5",
    name: "Ethan Davis",
    email: "ethan.davis@example.com",
    createdAt: "2024-01-01",
    updatedAt: "2024-02-28",
    status: "inactive",
  },
  {
    id: "6",
    name: "Fiona Wilson",
    email: "fiona.wilson@example.com",
    createdAt: "2023-09-20",
    updatedAt: "2024-03-01",
    status: "pending",
  },
  {
    id: "7",
    name: "George Taylor",
    email: "george.taylor@example.com",
    createdAt: "2024-02-10",
    updatedAt: "2024-03-05",
    status: "active",
  },
  {
    id: "8",
    name: "Hannah Moore",
    email: "hannah.moore@example.com",
    createdAt: "2023-12-01",
    updatedAt: "2024-03-10",
    status: "inactive",
  },
  {
    id: "9",
    name: "Ian White",
    email: "ian.white@example.com",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-12",
    status: "pending",
  },
  {
    id: "10",
    name: "Jack Hill",
    email: "jack.hill@example.com",
    createdAt: "2023-08-15",
    updatedAt: "2024-03-15",
    status: "active",
  },
];

type SortDirection = "asc" | "desc";

interface SortCriterion {
  field: keyof Client;
  direction: SortDirection;
  id: string;
}

const SortableTable: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sliderValue, setSliderValue] = useState([10]); // Default value
  const [filterOpen, setFilterOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const { toast } = useToast();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      const storedSortCriteria = localStorage.getItem("sortCriteria");
      if (storedSortCriteria) {
        setSortCriteria(JSON.parse(storedSortCriteria));
      }
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  useEffect(() => {
    localStorage.setItem("sortCriteria", JSON.stringify(sortCriteria));
    applySorting();
  }, [sortCriteria]); // Removed applySorting as a dependency

  const applySorting = useCallback(() => {
    const sortedClients = [...clients].sort((a, b) => {
      for (const criterion of sortCriteria) {
        const { field, direction } = criterion;
        const aValue = a[field];
        const bValue = b[field];

        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
    setClients(sortedClients);
  }, [sortCriteria]);

  const addSortCriterion = (field: keyof Client) => {
    const newCriterion: SortCriterion = {
      field,
      direction: "asc",
      id: Date.now().toString(),
    };
    setSortCriteria([...sortCriteria, newCriterion]);
    toast({
      title: "Sort Criterion Added",
      description: `Sorting by ${field}`,
    });
  };

  const toggleSortDirection = (id: string) => {
    setSortCriteria(
      sortCriteria.map((criterion) =>
        criterion.id === id
          ? {
              ...criterion,
              direction: criterion.direction === "asc" ? "desc" : "asc",
            }
          : criterion
      )
    );
    toast({
      title: "Sort Direction Toggled",
      description: `Toggled sort direction for ${
        sortCriteria.find((c) => c.id === id)?.field
      }`,
    });
  };

  const removeSortCriterion = (id: string) => {
    setSortCriteria(sortCriteria.filter((criterion) => criterion.id !== id));
    toast({
      title: "Sort Criterion Removed",
      description: "Removed a sort criterion",
    });
  };

  // Drag and drop functions
  const dragStart = (index: number) => {
    dragItem.current = index;
    setIsDragging(true);
  };

  const dragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const dragEnd = () => {
    setIsDragging(false);
    updateSortCriteriaOrder();
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const updateSortCriteriaOrder = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) {
      return;
    }
    const newSortCriteria = [...sortCriteria];
    // Splice out the item at the dragged index
    const draggedItemContent = newSortCriteria.splice(dragItem.current, 1)[0];
    // Splice in the item at the hovered index
    newSortCriteria.splice(dragOverItem.current, 0, draggedItemContent);
    // Reset the drag and drop params
    dragItem.current = null;
    dragOverItem.current = null;
    // Update the list
    setSortCriteria(newSortCriteria);
  }, [sortCriteria]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredClients = searchTerm
    ? clients.filter((client) =>
        Object.values(client).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : clients;

  const getSortIcon = (field: keyof Client, direction: SortDirection) => {
    switch (direction) {
      case "asc":
        return <SortAsc className="w-4 h-4 ml-1" />;
      case "desc":
        return <SortDesc className="w-4 h-4 ml-1" />;
      default:
        return <SortAsc className="w-4 h-4 ml-1" />;
    }
  };

  const sortPanelStyle: CSSProperties = {
    backgroundColor: "hsl(var(--secondary))", // Using Tailwind CSS variable
    color: "hsl(var(--secondary-foreground))", // Using Tailwind CSS variable
    borderRadius: "0.5rem",
    padding: "1rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const sortCriterionStyle: CSSProperties = {
    backgroundColor: "hsl(var(--accent))", // Using Tailwind CSS variable
    color: "hsl(var(--accent-foreground))", // Using Tailwind CSS variable
    borderRadius: "0.375rem",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const tableStyle: CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    borderRadius: "0.5rem",
    overflow: "hidden",
  };

  const tableHeaderStyle: CSSProperties = {
    backgroundColor: "hsl(var(--muted))", // Using Tailwind CSS variable
    color: "hsl(var(--muted-foreground))", // Using Tailwind CSS variable
    textAlign: "left",
    fontWeight: "bold",
    padding: "0.75rem",
    borderBottom: "1px solid hsl(var(--border))", // Using Tailwind CSS variable
  };

  const tableCellStyle: CSSProperties = {
    padding: "0.75rem",
    borderBottom: "1px solid hsl(var(--border))", // Using Tailwind CSS variable
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sortable Table</h1>

      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/3"
        />
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-4"
            side="bottom"
            align="start"
            sideOffset={10}
          >
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Price</h4>
              <p className="text-sm text-muted-foreground">
                Set the price range for the products.
              </p>
              <Separator className="my-2" />
              <div className="flex items-center space-x-2">
                <Label>From</Label>
                <Input type="number" placeholder="From" className="w-24" />
                <Label>To</Label>
                <Input type="number" placeholder="To" className="w-24" />
              </div>
              <div>
                <Label>Discount</Label>
                <Slider
                  defaultValue={sliderValue}
                  max={100}
                  step={1}
                  onValueChange={setSliderValue}
                />
              </div>
              <Button size="sm" className="mt-4">
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div style={sortPanelStyle}>
        <h2 className="text-lg font-semibold mb-2">Sort Panel</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border">
          <div className="space-y-2">
            {sortCriteria.map((criterion, index) => (
              <div
                key={criterion.id}
                draggable
                onDragStart={() => dragStart(index)}
                onDragEnter={() => dragEnter(index)}
                onDragEnd={dragEnd}
                onDragOver={(e) => e.preventDefault()}
                style={sortCriterionStyle}
                className={cn(
                  "flex items-center justify-between rounded-md border bg-secondary p-3 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                  isDragging && dragItem.current === index
                    ? "opacity-50"
                    : "opacity-100"
                )}
              >
                <div className="flex items-center">
                  <GripVertical className="w-4 h-4 mr-2 cursor-grab" />
                  <span>{criterion.field}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSortDirection(criterion.id)}
                  >
                    {getSortIcon(criterion.field, criterion.direction)}
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSortCriterion(criterion.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mt-2">
              <Plus className="w-4 h-4 mr-2" /> Add Sort Criterion
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => addSortCriterion("name")}>
              Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addSortCriterion("email")}>
              Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addSortCriterion("createdAt")}>
              Created At
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addSortCriterion("updatedAt")}>
              Updated At
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addSortCriterion("status")}>
              Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {clients.length === 0 ? (
        <Alert>
          <AlertTitle>No Clients Found</AlertTitle>
          <AlertDescription>
            Please add clients or adjust your search criteria.
          </AlertDescription>
        </Alert>
      ) : (
        <Table style={tableStyle}>
          <TableCaption>A list of your clients.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead style={tableHeaderStyle}>Name</TableHead>
              <TableHead style={tableHeaderStyle}>Email</TableHead>
              <TableHead style={tableHeaderStyle}>Created At</TableHead>
              <TableHead style={tableHeaderStyle}>Updated At</TableHead>
              <TableHead style={tableHeaderStyle}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell style={tableCellStyle}>{client.name}</TableCell>
                <TableCell style={tableCellStyle}>{client.email}</TableCell>
                <TableCell style={tableCellStyle}>{client.createdAt}</TableCell>
                <TableCell style={tableCellStyle}>{client.updatedAt}</TableCell>
                <TableCell style={tableCellStyle}>{client.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default SortableTable;
