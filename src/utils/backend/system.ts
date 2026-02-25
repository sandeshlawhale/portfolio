import SystemSettings from "@/models/SystemSettings";
import AdminLog from "@/models/AdminLog";

export const logAdminAction = async (
    actionType: string,
    entityAffected: string,
    adminId?: string
) => {
    try {
        await SystemSettings.findOneAndUpdate(
            {},
            {
                lastContentUpdate: new Date(),
            },
            { upsert: true }
        );

        await AdminLog.create({
            actionType,
            entityAffected,
            adminId,
        });
    } catch (error: any) {
        console.error("Failed to log admin action:", error.message);
    }
};
