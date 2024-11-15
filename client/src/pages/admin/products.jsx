import ProductImageUpload from "@/components/admin/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Toast } from '@/components/ui/toast';
import { toast, useToast } from '@/hooks/use-toast';
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminProductTile from "@/components/admin/product-tile";


const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
}

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData)
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("")
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { productList } = useSelector((state) => state.adminProducts);
    const dispatch = useDispatch();
    const toast = useToast();

    function onSubmit(event) {
        event.preventDefault();
    
        const finalFormData = currentEditedId !== null
            ? {
                ...formData,
                image: uploadedImageUrl // Ensure the new image URL is included
            }
            : {
                ...formData,
                image: uploadedImageUrl
            };
    
        currentEditedId !== null
            ? dispatch(editProduct({
                id: currentEditedId,
                formData: finalFormData,
            })).then((data) => {
                console.log(data);
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                }
            })
            : dispatch(addNewProduct(finalFormData)).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    toast({
                        title: "Product added successfully"
                    });
                }
            });
    }

    function handleDelete(getCurrentProductId) {
        dispatch(deleteProduct(getCurrentProductId)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
            }
        });
    }

    function isFormValid() {
        return Object.keys(formData)
            // .filter((currentKey) => currentKey !== "averageReview")
            .map((key) => formData[key] !== "")
            .every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    console.log(productList, uploadedImageUrl, 'productList');


    return (
        <Fragment>
            <div className="mb-5 flex justify-end">
                <Button className="shadow-sm bg-sky-200" variant="outline" onClick={() => setOpenCreateProductsDialog(true)}>Add new Products</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {
                    productList && productList.length > 0
                        ? productList.map((productItem) => (
                            <AdminProductTile
                                product={productItem}
                                setCurrentEditedId={setCurrentEditedId}
                                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                                setFormData={setFormData}
                                handleDelete={handleDelete}
                            />
                        ))
                        : null}
            </div>
            <Sheet
                open={openCreateProductsDialog}
                onOpenChange={() => {
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                }}
            >
                <SheetContent side="right" className="overflow-auto bg-white ">
                    <SheetHeader>
                        <SheetTitle className="text-3xl font-extrabold">
                            {currentEditedId !== null ? "Edit Product" : "Add New Product"}
                        </SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />
                    <div className="py-6 ">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            formControls={addProductFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}
export default AdminProducts;