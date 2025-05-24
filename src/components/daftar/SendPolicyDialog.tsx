import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

// Tipe data policy sesuai dengan respons dari backend
interface PolicyResponse {
  id: number;
  name: string;
  policy_status: string; // Sesuai field di backend
}

// Props untuk komponen dialog
interface SendPolicyDialogProps {
  onSuccess?: () => void;
  disabled?: boolean;
  selectedPolicyIds?: string[];
  children?: React.ReactNode;
  onSend?: () => void;
}

// Fungsi fetcher untuk SWR
const fetcher = (url: string) => axios.get(url).then(res => res.data);

// Forward ref ke button
const SendPolicyDialogComponent: React.ForwardRefRenderFunction<HTMLButtonElement, SendPolicyDialogProps> = (
  { onSuccess, disabled, selectedPolicyIds, children, onSend },
  ref
) => {
  const [openSendConfirmation, setOpenSendConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = localStorage.getItem("id");

  // Gunakan SWR untuk ambil data policy
  const { data: policiesData } = useSWR(
    userId ? `/api/policies/${userId}/diajukan` : null,
    fetcher
  );

  const handleSendPolicies = async () => {
    setIsLoading(true);
    try {
      if (!userId) throw new Error("User ID tidak ditemukan");

      let policiesToSend = selectedPolicyIds || [];

      // Ambil dari SWR cache jika belum ada selectedPolicyIds
      if (policiesToSend.length === 0 && policiesData?.data) {
        policiesToSend = policiesData.data
          .filter((policy: PolicyResponse) => policy.policy_status === "BELUM_TERVERIFIKASI")
          .map((policy: PolicyResponse) => policy.id.toString());
      }

      if (policiesToSend.length === 0) {
        toast.error("Tidak ada kebijakan yang memenuhi syarat untuk dikirim");
        setIsLoading(false);
        return;
      }

      // Kirim ke API untuk update status
      const sendRes = await axios.post("/api/policies/update-status", {
        policyIds: policiesToSend,
        userId: userId,
      });

      if (sendRes.status === 200) {
        toast.success("Kebijakan berhasil dikirim ke Koordinator Nasional");
        setOpenSendConfirmation(false);
        onSuccess?.();
        onSend?.();

        // Trigger revalidation
        mutate(`/api/policies/${userId}/diajukan`);
        mutate(`/api/policies/${userId}/disetujui`);
      } else {
        throw new Error(sendRes.data.message || "Gagal mengirim kebijakan");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengirim kebijakan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openSendConfirmation} onOpenChange={setOpenSendConfirmation}>
      <DialogTrigger asChild>
        {children || (
          <Button
            ref={ref as React.Ref<HTMLButtonElement>}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all duration-200"
            disabled={disabled}
          >
            <FaPaperPlane className="text-white" />
            Kirim Kebijakan
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <FaPaperPlane size={48} className="text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Konfirmasi Pengiriman</h2>
            <DialogDescription className="text-gray-600 mt-2">
              Anda yakin ingin mengirimkan data kebijakan ke Koordinator Nasional?
              <br />
              Data yang sudah dikirim tidak dapat diubah kembali.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-6 flex justify-end gap-3 w-full">
            <Button
              variant="secondary"
              onClick={() => setOpenSendConfirmation(false)}
              disabled={isLoading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              onClick={handleSendPolicies}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </span>
              ) : (
                "Kirim Sekarang"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.forwardRef(SendPolicyDialogComponent);