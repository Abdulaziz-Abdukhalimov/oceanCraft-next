import { BoardArticleStatus } from '../../enums/event.enum';

export interface BoardArticleUpdate {
	_id: string;
	articleStatus?: BoardArticleStatus;
	articleTitle?: string;
	articleContent?: string;
	articleImage?: string;
}
