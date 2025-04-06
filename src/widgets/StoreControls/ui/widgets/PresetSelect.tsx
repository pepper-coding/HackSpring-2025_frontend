import {
  useCreatePresetMutation,
  useGetPresetsQuery,
  useStoreActions,
} from "@/entities/Preset";
import { useShelvesActions } from "@/entities/Shelves";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Loader } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface PresetSelectProps {}

export const PresetSelect: FC<PresetSelectProps> = ({}) => {
  const { isLoading, data: presets } = useGetPresetsQuery();
  const [createPreset, {}] = useCreatePresetMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const { clearShelves, setShelves } = useShelvesActions();
  const { updatePreset } = useStoreActions();

  useEffect(() => {
    if (presets && presets?.length > 0) {
      const cachedSelectedPreset = localStorage.getItem("selectedPreset");
      if (cachedSelectedPreset) {
        setSelectedPreset(cachedSelectedPreset);
        handlePresetChange(cachedSelectedPreset);
      }
    }
  }, [presets]);

  const handlePresetChange = (presetId: string) => {
    if (presetId === "") return;

    setSelectedPreset(presetId);
    localStorage.setItem("selectedPreset", presetId);

    if (presetId === "new") {
      setIsModalOpen(true);
      return;
    }

    const preset = presets?.find((preset) => preset.id === presetId);
    if (preset) {
      updatePreset({
        height: 0,
        length: preset.height,
        width: preset.width,
        name: preset.name,
        id: preset.id,
        customerNumber: preset.customerNumber,
      });
      setShelves(preset.shelves);
    }
  };

  const handleClearAll = () => {
    clearShelves();
  };

  const onHandleCreatePreset = async () => {
    if (newPresetName === "") {
      return;
    }
    const { data } = await createPreset({
      width: 10,
      height: 10,
      customerNumber: 0,
      name: newPresetName,
    });

    if (data) {
      setIsModalOpen(false);
      setNewPresetName("");
      updatePreset({
        height: 0,
        length: data.height,
        width: data.width,
        id: data.id,
        name: data.name,
        customerNumber: data.customerNumber,
      });
      setShelves(data.shelves || []);
      setSelectedPreset(data.id);
    }
  };

  return (
    <>
      <Modal
        onClose={() => {
          setSelectedPreset("");
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        title="Create New Preset"
        footer={<Button onClick={onHandleCreatePreset}>Create</Button>}
      >
        <Input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
        />
      </Modal>
      <Card>
        <CardHeader>
          <CardTitle>Store Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset layout" />
              </SelectTrigger>
              <SelectContent>
                {isLoading && (
                  <SelectItem value="1">
                    <Loader />
                  </SelectItem>
                )}
                {presets?.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
                <SelectItem value="new">Create New Preset</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              className="w-full"
            >
              Clear All Shelves
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
