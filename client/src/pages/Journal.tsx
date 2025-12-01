import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface JournalEntry {
  _id: string;
  date: string;
  content: string;
  mood?: string;
}

const Journal = () => {
  const { toast } = useToast();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/journal`);
      if (!res.ok) throw new Error("Failed to fetch entries");
      const data = await res.json();
      setEntries(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // Save entry (create or update)
  const handleSave = async () => {
    if (!currentEntry.trim()) {
      toast({ title: "Entry is empty", description: "Write something before saving.", variant: "destructive" });
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/journal/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: currentEntry }),
        });
        if (!res.ok) throw new Error("Failed to update entry");
        toast({ title: "Updated", description: "Entry updated successfully" });
      } else {
        const res = await fetch(`${API_URL}/journal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: currentEntry }),
        });
        if (!res.ok) throw new Error("Failed to create entry");
        toast({ title: "Saved", description: "Entry created successfully" });
      }

      setCurrentEntry("");
      setIsEditing(false);
      setEditingId(null);
      fetchEntries();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || String(err), variant: "destructive" });
    }
  };

  // Delete entry
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/journal/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
      toast({ title: "Deleted", description: "Entry deleted successfully" });
      fetchEntries();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || String(err), variant: "destructive" });
    }
  };

  // Edit entry
  const handleEdit = (entry: JournalEntry) => {
    setEditingId(entry._id);
    setCurrentEntry(entry.content);
    setIsEditing(true);
  };

  // Format date nicely
  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Safe Space Journal</h1>
            <p className="text-muted-foreground">Your private space to document your journey.</p>
          </div>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="lg" className="w-full bg-gradient-calm">
              <Plus className="w-5 h-5 mr-2" />
              Write New Entry
            </Button>
          ) : (
            <Card className="p-6">
              <div className="space-y-4">
                <Textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[200px] resize-none"
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="bg-gradient-calm">
                    <Save className="w-4 h-4 mr-2" /> Save Entry
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentEntry("");
                      setIsEditing(false);
                      setEditingId(null);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Previous Entries</h2>
            {loading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Loading entries...</p>
              </Card>
            ) : entries.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No entries yet. Start writing above.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <Card key={entry._id} className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(entry)} variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => handleDelete(entry._id)} variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journal;
