import { mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

type FormField = {
  key: string;
  label: string;
  enabled: boolean;
  required: boolean;
  order: number;
  type: "text" | "textarea" | "select" | "radio" | "multiselect" | "date" | "time";
  options?: string[];
  showWhen?: {
    field: string;
    equals: string;
  };
};

/**
 * Validate catering request data against schema
 */
async function validateCateringRequest(ctx: QueryCtx, data: Record<string, unknown>) {
  const schema = await ctx.db.query("cateringFormSchema").first();
  const fields = (schema?.fields || []) as FormField[];
  
  const enabledFields = fields.filter((f) => f.enabled);
  
  // Check conditional fields - only validate if they should be visible
  const visibleFields = enabledFields.filter((field) => {
    if (field.showWhen) {
      const dependentValue = data[field.showWhen.field];
      return dependentValue === field.showWhen.equals;
    }
    return true;
  });
  
  const requiredFields = visibleFields.filter((f) => f.required);
  
  for (const field of requiredFields) {
    const value = data[field.key];
    
    if (field.type === "multiselect") {
      if (!value || !Array.isArray(value) || value.length === 0) {
        throw new Error(`${field.label} is required`);
      }
    } else if (!value || (typeof value === "string" && !value.trim())) {
      throw new Error(`${field.label} is required`);
    }
  }
  
  // Validate email format
  if (data.email && typeof data.email === "string" && !data.email.includes("@")) {
    throw new Error("Invalid email address");
  }
  
  // Validate fulfillmentType
  if (data.fulfillmentType && !["delivery", "pickup"].includes(data.fulfillmentType as string)) {
    throw new Error("Invalid fulfillment type");
  }
}

/**
 * Mutation to submit a catering request
 * Schema-driven: Fields are validated based on cateringFormSchema configuration.
 * 
 * After successful submission, trigger email notification.
 * TODO: Integrate Resend API here to send email notification
 * to restaurant staff about new catering request.
 */
export const submitRequest = mutation({
  args: {
    // All fields optional - validation enforces required fields from schema
    locationId: v.optional(v.id("locations")),
    name: v.optional(v.string()),
    companyName: v.optional(v.string()),
    fulfillmentType: v.optional(v.union(v.literal("delivery"), v.literal("pickup"))),
    deliveryAddress: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    alternatePhone: v.optional(v.string()),
    orderDate: v.optional(v.string()),
    orderReadyTime: v.optional(v.string()),
    numberOfPeople: v.optional(v.string()),
    cateringPackageOptions: v.optional(v.array(v.string())),
    pizzaOrderDetails: v.optional(v.string()),
    salads: v.optional(v.string()),
    drinks: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Validate against schema
    await validateCateringRequest(ctx, args);
    
    // Verify location exists if provided
    if (args.locationId) {
      const location = await ctx.db.get(args.locationId);
      if (!location) {
        throw new Error("Invalid location");
      }
    }

    // Build the request document
    type RequestData = {
      locationId?: Id<"locations">;
      name?: string;
      companyName?: string;
      fulfillmentType?: "delivery" | "pickup";
      deliveryAddress?: string;
      email?: string;
      phone?: string;
      alternatePhone?: string;
      orderDate?: string;
      orderReadyTime?: string;
      numberOfPeople?: string;
      cateringPackageOptions?: string[];
      pizzaOrderDetails?: string;
      salads?: string;
      drinks?: string;
      additionalNotes?: string;
      createdAt: number;
    };

    const requestData: RequestData = {
      createdAt: Date.now(),
    };

    // Add fields only if provided
    if (args.locationId) requestData.locationId = args.locationId;
    if (args.name) requestData.name = args.name;
    if (args.companyName) requestData.companyName = args.companyName;
    if (args.fulfillmentType) requestData.fulfillmentType = args.fulfillmentType;
    if (args.deliveryAddress) requestData.deliveryAddress = args.deliveryAddress;
    if (args.email) requestData.email = args.email;
    if (args.phone) requestData.phone = args.phone;
    if (args.alternatePhone) requestData.alternatePhone = args.alternatePhone;
    if (args.orderDate) requestData.orderDate = args.orderDate;
    if (args.orderReadyTime) requestData.orderReadyTime = args.orderReadyTime;
    if (args.numberOfPeople) requestData.numberOfPeople = args.numberOfPeople;
    if (args.cateringPackageOptions) requestData.cateringPackageOptions = args.cateringPackageOptions;
    if (args.pizzaOrderDetails) requestData.pizzaOrderDetails = args.pizzaOrderDetails;
    if (args.salads) requestData.salads = args.salads;
    if (args.drinks) requestData.drinks = args.drinks;
    if (args.additionalNotes) requestData.additionalNotes = args.additionalNotes;

    const requestId = await ctx.db.insert("cateringRequests", requestData);

    // TODO: Email notification integration
    // Example with Resend:
    // await sendEmail({
    //   to: "catering@stonefirepizza.com",
    //   subject: "New Catering Request",
    //   html: `New catering request from ${args.name}...`
    // });

    return { success: true, id: requestId };
  },
});

