import { Injectable } from '@angular/core';

export class EmailModel {
	subject: string;
	toAddr: string;
	toName: string;
	fromAddr: string;
	fromName: string;
	message: string;
	redirectTo: string;
}