import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Box,
	Button,
	Stack,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Card,
	IconButton,
	Stepper,
	Step,
	StepLabel,
	Switch,
	FormControlLabel,
	InputAdornment,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';
import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
} from '../../enums/product.enum';

const steps = ['Basic Info', 'Details', 'Pricing', 'Images'];

const AddProduct = () => {
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const token = getJwtToken();
	const [activeStep, setActiveStep] = useState(0);

	const [productData, setProductData] = useState({
		productCategory: '',
		productCondition: '',
		productTitle: '',
		productBrand: '',
		productModel: '',
		productEngineType: '',
		productSpeed: 0,
		productLength: 0,
		productPriceType: '',
		productRentPeriod: '',
		productPrice: 0,
		productCurrency: 'KRW',
		productImages: [] as string[],
		productAddress: '',
		productDescription: '',
		productRent: false,
		productBuildYear: '',
	});

	// Mutations
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	// Get product if editing
	const { data: productInfo } = useQuery(GET_PRODUCT, {
		skip: !router.query.productId,
		variables: { input: router.query.productId },
		onCompleted: (data) => {
			const product = data?.getProduct;
			if (product) {
				setProductData({
					productCategory: product.productCategory || '',
					productCondition: product.productCondition || '',
					productTitle: product.productTitle || '',
					productBrand: product.productBrand || '',
					productModel: product.productModel || '',
					productEngineType: product.productEngineType || '',
					productSpeed: product.productSpeed || 0,
					productLength: product.productLength || 0,
					productPriceType: product.productPriceType || '',
					productRentPeriod: product.productRentPeriod || '',
					productPrice: product.productPrice || 0,
					productCurrency: product.productCurrency || 'USD',
					productImages: product.productImages || [],
					productAddress: product.productAddress || '',
					productDescription: product.productDescription || '',
					productRent: product.productRent || false,
					productBuildYear: product.productBuildYear || '',
				});
			}
		},
	});

	// Upload images
	const uploadImages = async () => {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length === 0) return;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: Array(selectedFiles.length).fill(null),
						target: 'products',
					},
				}),
			);

			const map: any = {};
			for (let i = 0; i < selectedFiles.length; i++) {
				map[i.toString()] = [`variables.files.${i}`];
			}
			formData.append('map', JSON.stringify(map));

			for (let i = 0; i < selectedFiles.length; i++) {
				formData.append(i.toString(), selectedFiles[i]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;
			setProductData({ ...productData, productImages: [...productData.productImages, ...responseImages] });
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	// Remove image
	const removeImage = (index: number) => {
		const newImages = productData.productImages.filter((_, i) => i !== index);
		setProductData({ ...productData, productImages: newImages });
	};

	// Handle submit
	const handleSubmit = async () => {
		try {
			const submitData: any = {
				productCategory: productData.productCategory,
				productCondition: productData.productCondition,
				productTitle: productData.productTitle,
				productBrand: productData.productBrand,
				productModel: productData.productModel,
				productEngineType: productData.productEngineType,
				productSpeed: productData.productSpeed,
				productLength: productData.productLength,
				productPriceType: productData.productPriceType,
				productPrice: productData.productPrice,
				productCurrency: productData.productCurrency,
				productImages: productData.productImages,
				productAddress: productData.productAddress,
				productDescription: productData.productDescription,
				productRent: productData.productRent,
				productBuildYear: productData.productBuildYear,
			};

			// Only add productRentPeriod if price type is RENT
			if (productData.productPriceType === 'RENT' && productData.productRentPeriod) {
				submitData.productRentPeriod = productData.productRentPeriod;
			}

			if (router.query.productId) {
				await updateProduct({
					variables: {
						input: {
							_id: router.query.productId,
							...submitData,
						},
					},
				});
				await sweetMixinSuccessAlert('Product updated successfully!');
			} else {
				await createProduct({
					variables: { input: submitData },
				});
				await sweetMixinSuccessAlert('Product created successfully!');
			}
			router.push('/mypage?category=myProducts');
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const handleNext = () => setActiveStep((prev) => prev + 1);
	const handleBack = () => setActiveStep((prev) => prev - 1);

	const isStepValid = () => {
		switch (activeStep) {
			case 0:
				return productData.productCategory && productData.productCondition && productData.productTitle;
			case 1:
				return productData.productBrand && productData.productModel;
			case 2:
				return productData.productPrice > 0 && productData.productPriceType;
			case 3:
				return productData.productImages.length > 0;
			default:
				return false;
		}
	};

	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
			{/* Header */}
			<Stack spacing={1} mb={4}>
				<Typography variant="h4" fontWeight={700}>
					{router.query.productId ? 'Edit Product' : 'Add New Product'}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Fill in the details to list your water sports equipment
				</Typography>
			</Stack>

			{/* Stepper */}
			<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			{/* Form Content */}
			<Card sx={{ p: 4, mb: 3 }}>
				{/* Step 0: Basic Info */}
				{activeStep === 0 && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" mb={2}>
								Basic Information
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Category *</InputLabel>
								<Select
									value={productData.productCategory}
									onChange={(e) => setProductData({ ...productData, productCategory: e.target.value })}
									label="Category"
								>
									{Object.values(ProductCategory).map((cat) => (
										<MenuItem key={cat} value={cat}>
											{cat.replace(/_/g, ' ')}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Condition *</InputLabel>
								<Select
									value={productData.productCondition}
									onChange={(e) => setProductData({ ...productData, productCondition: e.target.value })}
									label="Condition"
								>
									{Object.values(ProductCondition).map((cond) => (
										<MenuItem key={cond} value={cond}>
											{cond}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Product Title *"
								value={productData.productTitle}
								onChange={(e) => setProductData({ ...productData, productTitle: e.target.value })}
								placeholder="e.g., 2023 Yamaha WaveRunner"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={4}
								label="Description"
								value={productData.productDescription}
								onChange={(e) => setProductData({ ...productData, productDescription: e.target.value })}
								placeholder="Describe your product..."
							/>
						</Grid>
					</Grid>
				)}

				{/* Step 1: Details */}
				{activeStep === 1 && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" mb={2}>
								Product Details
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Brand *"
								value={productData.productBrand}
								onChange={(e) => setProductData({ ...productData, productBrand: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Model *"
								value={productData.productModel}
								onChange={(e) => setProductData({ ...productData, productModel: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Engine Type"
								value={productData.productEngineType}
								onChange={(e) => setProductData({ ...productData, productEngineType: e.target.value })}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Build Year"
								value={productData.productBuildYear}
								onChange={(e) => setProductData({ ...productData, productBuildYear: e.target.value })}
								placeholder="2023"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Speed (km/h)"
								value={productData.productSpeed}
								onChange={(e) => setProductData({ ...productData, productSpeed: parseInt(e.target.value) || 0 })}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Length (meters)"
								value={productData.productLength}
								onChange={(e) => setProductData({ ...productData, productLength: parseInt(e.target.value) || 0 })}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Location"
								value={productData.productAddress}
								onChange={(e) => setProductData({ ...productData, productAddress: e.target.value })}
								placeholder="Marina, City, Country"
							/>
						</Grid>
					</Grid>
				)}

				{/* Step 2: Pricing */}
				{activeStep === 2 && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" mb={2}>
								Pricing Information
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Price Type *</InputLabel>
								<Select
									value={productData.productPriceType}
									onChange={(e) => setProductData({ ...productData, productPriceType: e.target.value })}
									label="Price Type"
								>
									{Object.values(ProductPriceType).map((type) => (
										<MenuItem key={type} value={type}>
											{type}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						{productData.productPriceType === 'RENT' && (
							<Grid item xs={12} md={6}>
								<FormControl fullWidth>
									<InputLabel>Rent Period</InputLabel>
									<Select
										value={productData.productRentPeriod}
										onChange={(e) => setProductData({ ...productData, productRentPeriod: e.target.value })}
										label="Rent Period"
									>
										{Object.values(ProductRentPeriod).map((period) => (
											<MenuItem key={period} value={period}>
												Per {period}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						)}
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Price *"
								value={productData.productPrice}
								onChange={(e) => setProductData({ ...productData, productPrice: parseInt(e.target.value) || 0 })}
								InputProps={{
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Currency</InputLabel>
								<Select
									value={productData.productCurrency}
									onChange={(e) => setProductData({ ...productData, productCurrency: e.target.value })}
									label="Currency"
								>
									{Object.values(ProductCurrency).map((curr) => (
										<MenuItem key={curr} value={curr}>
											{curr}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={
									<Switch
										checked={productData.productRent}
										onChange={(e) => setProductData({ ...productData, productRent: e.target.checked })}
									/>
								}
								label="Available for rent"
							/>
						</Grid>
					</Grid>
				)}

				{/* Step 3: Images */}
				{activeStep === 3 && (
					<Box>
						<Typography variant="h6" mb={2}>
							Product Images
						</Typography>
						<Box
							sx={{
								border: '2px dashed #ccc',
								borderRadius: 2,
								p: 4,
								textAlign: 'center',
								mb: 3,
								cursor: 'pointer',
								'&:hover': { borderColor: '#1976d2' },
							}}
							onClick={() => inputRef.current?.click()}
						>
							<CloudUploadIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
							<Typography variant="body1" mb={1}>
								Drag and drop images or click to browse
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Maximum 5 images (JPEG, PNG)
							</Typography>
							<input ref={inputRef} type="file" hidden multiple accept="image/*" onChange={uploadImages} />
						</Box>

						{/* Image Preview */}
						<Grid container spacing={2}>
							{productData.productImages.map((image: string, index: number) => (
								<Grid item xs={6} md={3} key={index}>
									<Card sx={{ position: 'relative' }}>
										<img
											src={`${image}`}
											alt={`Product ${index + 1}`}
											style={{ width: '100%', height: 200, objectFit: 'cover' }}
										/>
										<IconButton
											sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
											onClick={() => removeImage(index)}
											size="small"
										>
											<DeleteIcon />
										</IconButton>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</Card>

			{/* Navigation Buttons */}
			<Stack direction="row" spacing={2} justifyContent="space-between">
				<Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" size="large">
					Back
				</Button>
				<Box sx={{ flex: 1 }} />
				{activeStep === steps.length - 1 ? (
					<Button onClick={handleSubmit} variant="contained" size="large" disabled={!isStepValid()}>
						{router.query.productId ? 'Update Product' : 'Create Product'}
					</Button>
				) : (
					<Button onClick={handleNext} variant="contained" size="large" disabled={!isStepValid()}>
						Next
					</Button>
				)}
			</Stack>
		</Box>
	);
};

export default AddProduct;
